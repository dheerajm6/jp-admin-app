import React, { useState, useEffect } from 'react'
import { Button, Modal, Typography, Space } from 'antd'
import { DownloadOutlined, MobileOutlined, CloseOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface PWAInstallPromptProps {
  onClose?: () => void
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show install prompt after a delay
      setTimeout(() => setShowInstallPrompt(true), 3000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('JanPulse Admin PWA: App was installed')
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('JanPulse Admin PWA: User accepted the install prompt')
    } else {
      console.log('JanPulse Admin PWA: User dismissed the install prompt')
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    onClose?.()
  }

  // Don't show if already installed or no prompt available
  if (isInstalled || !deferredPrompt || !showInstallPrompt) {
    return null
  }

  return (
    <Modal
      open={showInstallPrompt}
      onCancel={handleDismiss}
      footer={null}
      closeIcon={<CloseOutlined style={{ color: '#6b7280' }} />}
      centered
      width={window.innerWidth <= 640 ? Math.min(400, window.innerWidth - 32) : 400}
      styles={{
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
        content: { 
          borderRadius: '16px', 
          overflow: 'hidden',
          margin: window.innerWidth <= 640 ? '16px' : '0'
        }
      }}
      className={window.innerWidth <= 640 ? 'pwa-mobile' : ''}
    >
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
        color: 'white',
        padding: '24px',
        margin: '-24px -24px 24px -24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}>
            ✚
          </div>
          <div>
            <Title level={3} style={{ margin: 0, color: 'white', fontWeight: 700 }}>
              Install JanPulse Admin
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
              Access your dashboard anywhere, anytime
            </Text>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
              Install our Progressive Web App to get the best experience on mobile and desktop devices.
            </Text>
          </div>

          <div style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <Title level={5} style={{ margin: '0 0 12px 0', color: '#1f2937' }}>
              ✨ Key Benefits:
            </Title>
            <Space direction="vertical" size="small">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MobileOutlined style={{ color: '#8b5cf6' }} />
                <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                  Works offline with cached data
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MobileOutlined style={{ color: '#8b5cf6' }} />
                <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                  Fast loading and smooth performance
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MobileOutlined style={{ color: '#8b5cf6' }} />
                <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                  Native app-like experience
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MobileOutlined style={{ color: '#8b5cf6' }} />
                <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                  Push notifications for updates
                </Text>
              </div>
            </Space>
          </div>

          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button
              size="large"
              onClick={handleDismiss}
              style={{
                borderRadius: '8px',
                height: '44px',
                color: '#6b7280'
              }}
            >
              Maybe Later
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<DownloadOutlined />}
              onClick={handleInstallClick}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                border: 'none',
                borderRadius: '8px',
                height: '44px',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
            >
              Install App
            </Button>
          </Space>
        </Space>
      </div>
    </Modal>
  )
}

export default PWAInstallPrompt