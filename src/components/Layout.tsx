import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  AppShell, 
  Text, 
  Group, 
  Button, 
  Avatar, 
  ActionIcon,
  TextInput,
  Stack,
  UnstyledButton,
  Badge
} from '@mantine/core'
import { 
  IconDashboard,
  IconUpload,
  IconUsers,
  IconUser,
  IconLogout,
  IconBell,
  IconSearch,
  IconPlus
} from '@tabler/icons-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
  }

  const menuItems = [
    { path: '/', label: 'Overview', icon: IconDashboard },
    { path: '/data-uploads', label: 'Data Uploads', icon: IconUpload },
    { path: '/user-requests', label: 'User Requests', icon: IconUsers },
    { path: '/profile', label: 'Profile', icon: IconUser },
  ]

  const NavbarLink = ({ item }: { item: typeof menuItems[0] }) => {
    const isActive = location.pathname === item.path
    const Icon = item.icon
    
    return (
      <UnstyledButton
        onClick={() => navigate(item.path)}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          color: isActive ? '#7c3aed' : '#6b7280',
          backgroundColor: isActive ? '#f5f3ff' : 'transparent',
          fontWeight: isActive ? 600 : 400,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = '#f9fafb'
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <Icon size={20} style={{ marginRight: '12px' }} />
        <Text size="sm">{item.label}</Text>
      </UnstyledButton>
    )
  }

  return (
    <AppShell
      navbar={{
        width: 280,
        breakpoint: 'sm',
      }}
      header={{ height: 80 }}
      padding="0"
      styles={{
        main: {
          backgroundColor: '#f8fafc',
          minHeight: '100vh'
        }
      }}
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="xl">
          {/* Left: Logo and App Name */}
          <Group>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              ✚
            </div>
            <div>
              <Text fw={700} size="lg" c="dark">JanPulse</Text>
            </div>
          </Group>

          {/* Center: Search */}
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={16} />}
            style={{ width: '400px' }}
            styles={{
              input: {
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px'
              }
            }}
          />

          {/* Right: Actions and User */}
          <Group>
            <Button 
              leftSection={<IconPlus size={16} />}
              gradient={{ from: 'violet', to: 'purple' }}
              radius="lg"
              size="sm"
            >
              Register Representative
            </Button>
            
            <ActionIcon variant="light" color="gray" size="lg" radius="lg">
              <IconBell size={18} />
              <Badge 
                size="xs" 
                color="red" 
                style={{ 
                  position: 'absolute', 
                  top: '4px', 
                  right: '4px',
                  minWidth: '8px',
                  height: '8px',
                  padding: 0
                }}
              />
            </ActionIcon>
            
            <Avatar 
              color="violet" 
              radius="lg" 
              size="md"
            >
              {user?.email?.charAt(0).toUpperCase() || 'EK'}
            </Avatar>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          {menuItems.map((item) => (
            <NavbarLink key={item.path} item={item} />
          ))}
        </Stack>
        
        {/* Bottom section with user info and logout */}
        <div style={{ 
          marginTop: 'auto', 
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <Group justify="space-between">
            <Group>
              <Avatar size="sm" color="violet">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
              <div>
                <Text size="sm" fw={500}>
                  {user?.email?.split('@')[0] || 'Admin'}
                </Text>
                <Text size="xs" c="dimmed">
                  {user?.email}
                </Text>
              </div>
            </Group>
            <ActionIcon 
              variant="light" 
              color="gray" 
              onClick={handleSignOut}
              title="Sign Out"
            >
              <IconLogout size={16} />
            </ActionIcon>
          </Group>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  )
}

export default Layout