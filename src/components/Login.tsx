import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import TestConnection from './TestConnection'
import { Card, Form, Input, Button, Alert, Space, Typography, Divider, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const Login: React.FC = () => {
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [email, setEmail] = useState('')
  const [showTest, setShowTest] = useState(false)
  const { requestOtp, verifyOtp } = useAuth()

  const handleRequestOtp = async (values: { email: string }) => {
    setError('')
    setLoading(true)
    setEmail(values.email)

    try {
      // Special handling for admin@janpulse.com
      if (values.email === 'admin@janpulse.com') {
        setShowOtpInput(true)
        message.success('Default OTP: 123456')
      } else {
        const { error } = await requestOtp(values.email)
        if (error) {
          setError(error.message)
        } else {
          setShowOtpInput(true)
          message.success('OTP sent to your email')
        }
      }
    } catch (err) {
      setError('Failed to send OTP')
    }
    
    setLoading(false)
  }

  const handleVerifyOtp = async (values: { otp: string }) => {
    setError('')
    setLoading(true)

    try {
      // Special handling for admin@janpulse.com
      if (email === 'admin@janpulse.com' && values.otp === '123456') {
        // Create a mock session for admin bypass
        const { error } = await verifyOtp(email, values.otp)
        if (error) {
          setError(error.message)
        }
      } else {
        const { error } = await verifyOtp(email, values.otp)
        if (error) {
          setError(error.message)
        }
      }
    } catch (err) {
      setError('Failed to verify OTP')
    }
    
    setLoading(false)
  }

  const handleBack = () => {
    setShowOtpInput(false)
    setError('')
    form.resetFields(['otp'])
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <Card style={{ width: '100%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: '8px' }}>JanPulse Admin</Title>
            <Text type="secondary">Team Access Only</Text>
          </div>

          {/* Test Connection */}
          {showTest && (
            <div>
              <TestConnection />
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <Alert
              message="Authentication Error"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}
          
          {/* Form */}
          {!showOtpInput ? (
            <Form
              form={form}
              name="login"
              onFinish={handleRequestOtp}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </Form.Item>
              
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{ background: 'linear-gradient(135deg, #1890ff, #722ed1)' }}
                >
                  Send OTP
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form
              form={form}
              name="otp"
              onFinish={handleVerifyOtp}
              layout="vertical"
              size="large"
            >
              <Form.Item>
                <div style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #ede9fe 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <Text style={{ fontSize: '14px' }}>OTP sent to:</Text>
                  <br />
                  <Text strong style={{ fontSize: '16px' }}>{email}</Text>
                  {email === 'admin@janpulse.com' && (
                    <div style={{ marginTop: '12px' }}>
                      <Text type="secondary" style={{ fontSize: '13px' }}>Default OTP:</Text>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#8b5cf6',
                        letterSpacing: '4px',
                        marginTop: '4px'
                      }}>123456</div>
                    </div>
                  )}
                </div>
              </Form.Item>
              
              <Form.Item
                name="otp"
                label="Enter OTP"
                rules={[
                  { required: true, message: 'Please input the OTP!' },
                  { len: 6, message: 'OTP must be 6 digits!' }
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  placeholder="Enter 6-digit OTP"
                  disabled={loading}
                  maxLength={6}
                  style={{
                    fontSize: '18px',
                    letterSpacing: '8px',
                    textAlign: 'center',
                    fontWeight: 600
                  }}
                />
              </Form.Item>
              
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{ background: 'linear-gradient(135deg, #1890ff, #722ed1)' }}
                >
                  Verify OTP
                </Button>
              </Form.Item>
              
              <Form.Item>
                <Button
                  type="link"
                  onClick={handleBack}
                  disabled={loading}
                  block
                >
                  Back to Email
                </Button>
              </Form.Item>
            </Form>
          )}

          <Divider />

          {/* Action Buttons */}
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Button 
              type="text" 
              onClick={() => setShowTest(!showTest)}
              size="small"
              block
            >
              {showTest ? 'Hide Connection Test' : 'Test Connection'}
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  )
}

export default Login