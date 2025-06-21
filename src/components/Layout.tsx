import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Layout as AntLayout, 
  Menu, 
  Button, 
  Avatar, 
  Input,
  Space,
  Badge,
  Dropdown,
  Typography,
  Tooltip
} from 'antd'
import './Layout.module.css'
import PWAInstallPrompt from './PWAInstallPrompt'
import { 
  DashboardOutlined,
  UploadOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  ApiOutlined
} from '@ant-design/icons'

const { Header, Sider, Content, Footer } = AntLayout
const { Text, Title } = Typography

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768)
  
  const handleSignOut = async () => {
    await signOut()
  }

  // Handle window resize for responsive design
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setCollapsed(true)
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // Call initially
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuItems = [
    { key: '/', label: 'Overview', icon: <DashboardOutlined /> },
    { key: '/data-uploads', label: 'Data Uploads', icon: <UploadOutlined /> },
    { key: '/signup-requests', label: 'Sign-up Requests', icon: <TeamOutlined /> },
    { key: '/reports', label: 'Reports', icon: <FileTextOutlined /> },
    { key: '/analytics', label: 'Analytics', icon: <BarChartOutlined /> },
    { key: '/integrations', label: 'Integrations', icon: <ApiOutlined /> },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      onClick: handleSignOut
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PWAInstallPrompt />
      <AntLayout style={{ flex: 1 }}>
        <Sider 
          trigger={null}
          collapsible 
          collapsed={collapsed}
          width={240}
          collapsedWidth={80}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderRight: '1px solid #f0f0f0',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
        <div 
          className="logo-container" 
          onClick={() => setCollapsed(!collapsed)}
          style={{ 
            padding: collapsed ? '20px 10px' : '20px', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            background: 'rgba(139, 92, 246, 0.04)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.04)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ 
            width: collapsed ? '36px' : '40px', 
            height: collapsed ? '36px' : '40px', 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: collapsed ? '18px' : '20px',
            marginRight: collapsed ? '0' : '12px',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}>
            ✚
            {/* Subtle indicator that it's clickable */}
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '12px',
              height: '12px',
              background: collapsed ? '#10b981' : '#f59e0b',
              borderRadius: '50%',
              border: '2px solid white',
              fontSize: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}>
              {collapsed ? '→' : '←'}
            </div>
          </div>
          
          {!collapsed && (
            <div style={{ flex: 1 }}>
              <Title level={4} style={{ margin: 0, color: '#1f2937', fontWeight: 700 }}>
                JanPulse
              </Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.5px' }}>
                  ADMIN PORTAL
                </Text>
                <Tooltip title="Click logo to collapse sidebar">
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'rgba(139, 92, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#8b5cf6',
                    animation: 'pulse 2s infinite'
                  }}>
                    ←
                  </div>
                </Tooltip>
              </div>
            </div>
          )}
          
          {collapsed && (
            <Tooltip title="Click to expand sidebar" placement="right">
              <div style={{ position: 'absolute', inset: 0 }} />
            </Tooltip>
          )}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.map(item => ({
            ...item,
            style: { marginBottom: '4px' },
            label: collapsed ? (
              <Tooltip placement="right" title={item.label}>
                <span>{item.label}</span>
              </Tooltip>
            ) : item.label
          }))}
          onClick={(e) => navigate(e.key)}
          style={{ 
            border: 'none', 
            marginTop: '24px',
            background: 'transparent',
            padding: '0 8px'
          }}
          inlineCollapsed={collapsed}
        />
      </Sider>
      
      <AntLayout>
        <Header style={{ 
          padding: '0 32px', 
          background: 'linear-gradient(90deg, #ffffff 0%, #fafbfc 100%)', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-end',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          borderBottom: '1px solid #f0f0f0',
          height: '72px'
        }}>
          <Space size="large">
            <Input
              placeholder="Search anything..."
              prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
              className={isMobile ? 'mobile-search' : ''}
              style={{ 
                width: isMobile ? '200px' : '320px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#f3f4f6',
                height: '40px',
                color: '#1f2937'
              }}
            />
            
            <Badge count={5} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined style={{ fontSize: '20px', color: '#6b7280' }} />} 
                size="large" 
                style={{ 
                  width: '40px', 
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar 
                style={{ 
                  backgroundColor: '#8b5cf6', 
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  fontSize: '18px',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                }}
              >
                {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: isMobile ? '16px' : '24px', 
          padding: isMobile ? '16px' : '32px', 
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          borderRadius: '16px',
          minHeight: 'calc(100vh - 200px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #f0f0f0'
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
    
    <Footer style={{ 
      textAlign: 'center',
      background: 'linear-gradient(180deg, #fafbfc 0%, #f3f4f6 100%)',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      padding: '24px 50px',
      width: '100%'
    }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            ✚
          </div>
          <Text style={{ color: '#374151', fontSize: '14px', fontWeight: 600 }}>
            JanPulse Admin Portal
          </Text>
          <Text style={{ color: '#6b7280', fontSize: '14px' }}>
            © {new Date().getFullYear()}
          </Text>
        </div>
        <Space split={<span style={{ color: '#d1d5db' }}>•</span>} size="large">
          <Text style={{ color: '#6b7280', fontSize: '13px' }}>🚀 Empowering Democracy</Text>
          <Text style={{ color: '#6b7280', fontSize: '13px' }}>v1.0.0</Text>
          <a href="#" style={{ 
            color: '#8b5cf6', 
            fontSize: '13px', 
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}
          className={isMobile ? 'footer-desktop-only' : ''}
          onMouseEnter={(e) => e.currentTarget.style.color = '#7c3aed'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#8b5cf6'}
          >
            💬 Support
          </a>
          <a href="#" style={{ 
            color: '#8b5cf6', 
            fontSize: '13px',
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}
          className={isMobile ? 'footer-desktop-only' : ''}
          onMouseEnter={(e) => e.currentTarget.style.color = '#7c3aed'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#8b5cf6'}
          >
            📚 Documentation
          </a>
        </Space>
      </Space>
    </Footer>
  </div>
  )
}

export default Layout