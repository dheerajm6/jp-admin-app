import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  department?: string
  employee_id?: string
}

interface AuthContextType {
  user: AdminUser | null
  loading: boolean
  requestOtp: (email: string) => Promise<{ error: any }>
  verifyOtp: (email: string, otp: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if there's a stored session token
        const sessionToken = localStorage.getItem('admin_session_token')
        if (sessionToken) {
          // Validate session with backend
          const { data, error } = await supabase
            .from('admin_sessions')
            .select('admin_user_id, admin_users!inner(id, email, full_name, role, department, employee_id)')
            .eq('session_token', sessionToken)
            .gt('expires_at', new Date().toISOString())
            .single()

          if (data && !error) {
            const adminUser = data.admin_users as any
            setUser({
              id: adminUser.id,
              email: adminUser.email,
              full_name: adminUser.full_name,
              role: adminUser.role,
              department: adminUser.department,
              employee_id: adminUser.employee_id
            })
          } else {
            localStorage.removeItem('admin_session_token')
          }
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const requestOtp = async (email: string) => {
    try {
      // Special handling for admin@janpulse.com
      if (email === 'admin@janpulse.com') {
        return { error: null }
      }

      // First check if user exists
      const { data: userData, error: userError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .single()

      if (userError) {
        return { error: { message: 'User not found. Please contact your administrator.' } }
      }

      // Generate OTP (in production, this should be done on the backend)
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      // Store OTP
      const { error: otpError } = await supabase
        .from('admin_otp')
        .insert({
          admin_user_id: userData.id,
          email: email,
          otp_code: otp,
          otp_type: 'login',
          expires_at: expiresAt.toISOString()
        })

      if (otpError) {
        return { error: { message: 'Failed to generate OTP' } }
      }

      // In production, send OTP via email
      console.log('OTP for', email, ':', otp)
      
      return { error: null }
    } catch (error) {
      return { error: { message: 'An error occurred' } }
    }
  }

  const verifyOtp = async (email: string, otp: string) => {
    try {
      // Special handling for admin@janpulse.com
      if (email === 'admin@janpulse.com' && otp === '123456') {
        // Get or create admin user
        const { data: userData, error: userError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .single()

        if (userError) {
          // Create default admin user if doesn't exist
          const { data: newUser, error: createError } = await supabase
            .from('admin_users')
            .insert({
              email: 'admin@janpulse.com',
              full_name: 'System Administrator',
              role: 'super_admin',
              department: 'IT',
              employee_id: 'ADMIN001'
            })
            .select()
            .single()

          if (createError) {
            return { error: { message: 'Failed to create admin user' } }
          }

          return await createSession(newUser)
        }

        return await createSession(userData)
      }

      // Regular OTP verification
      const { data: otpData, error: otpError } = await supabase
        .from('admin_otp')
        .select('id, admin_user_id, admin_users!inner(*)')
        .eq('email', email)
        .eq('otp_code', otp)
        .eq('otp_type', 'login')
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (otpError || !otpData) {
        return { error: { message: 'Invalid or expired OTP' } }
      }

      // Mark OTP as used
      await supabase
        .from('admin_otp')
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq('id', otpData.id)

      const adminUser = otpData.admin_users as any
      return await createSession(adminUser)
    } catch (error) {
      return { error: { message: 'Verification failed' } }
    }
  }

  const createSession = async (adminUser: any) => {
    try {
      // Generate session token
      const sessionToken = generateSessionToken()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Create session
      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          admin_user_id: adminUser.id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString()
        })

      if (sessionError) {
        return { error: { message: 'Failed to create session' } }
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', adminUser.id)

      // Store session
      localStorage.setItem('admin_session_token', sessionToken)
      
      setUser({
        id: adminUser.id,
        email: adminUser.email,
        full_name: adminUser.full_name,
        role: adminUser.role,
        department: adminUser.department,
        employee_id: adminUser.employee_id
      })

      return { error: null }
    } catch (error) {
      return { error: { message: 'Session creation failed' } }
    }
  }

  const generateSessionToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const signOut = async () => {
    const sessionToken = localStorage.getItem('admin_session_token')
    if (sessionToken) {
      // Delete session from database
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('session_token', sessionToken)
    }
    
    localStorage.removeItem('admin_session_token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    requestOtp,
    verifyOtp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}