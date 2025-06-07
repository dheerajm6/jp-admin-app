import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const TestConnection: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...')
  const [userCount, setUserCount] = useState<number>(0)

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setStatus(`Connection Error: ${error.message}`)
        return
      }

      // Test database connection
      const { data: users, error: dbError } = await supabase.auth.admin.listUsers()
      
      if (dbError) {
        setStatus(`Database Error: ${dbError.message}`)
        return
      }

      setUserCount(users.users.length)
      setStatus('✅ Supabase connection successful!')
      
    } catch (error) {
      setStatus(`❌ Connection failed: ${error}`)
    }
  }

  React.useEffect(() => {
    testConnection()
  }, [])

  const createTestUser = async () => {
    try {
      // Try to create user with auto-confirm
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@janpulse.com',
        password: 'JanPulse2025!',
        options: {
          emailRedirectTo: undefined
        }
      })

      if (error) {
        alert(`Error creating user: ${error.message}\n\nPlease go to your Supabase dashboard > Authentication > Settings and disable "Enable email confirmations" for development.`)
        return
      }

      if (data.user && !data.user.email_confirmed_at) {
        alert('⚠️ User created but email confirmation is required!\n\nOptions:\n1. Check your email for verification link\n2. Go to Supabase Dashboard > Authentication > Settings > disable "Enable email confirmations"\n3. Or manually confirm the user in Supabase Dashboard > Authentication > Users')
      } else {
        alert('✅ Test user created and ready to use!')
      }
      
      testConnection()
    } catch (error) {
      alert(`Error: ${error}`)
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f8f9fa', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3>Supabase Connection Test</h3>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Users in database:</strong> {userCount}</p>
      
      {userCount === 0 && (
        <div>
          <p style={{ color: 'orange' }}>
            ⚠️ No users found. You need to create a user account first.
          </p>
          <button 
            onClick={createTestUser}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Create Test User (admin@janpulse.com)
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '15px', padding: '15px', background: '#e7f3ff', borderRadius: '5px', fontSize: '14px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>🔧 Quick Fix for "Email not confirmed" error:</h4>
        <ol style={{ margin: '0', paddingLeft: '20px' }}>
          <li><strong>Go to your Supabase Dashboard</strong></li>
          <li><strong>Authentication → Settings</strong></li>
          <li><strong>Scroll down to "User Signups"</strong></li>
          <li><strong>Turn OFF "Enable email confirmations"</strong></li>
          <li><strong>Save settings</strong></li>
          <li><strong>Try creating the test user again</strong></li>
        </ol>
        <p style={{ margin: '10px 0 0 0', fontStyle: 'italic' }}>
          This disables email verification for development. Re-enable it for production.
        </p>
      </div>
    </div>
  )
}

export default TestConnection