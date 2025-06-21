import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PoliticalIntelligence from './PoliticalIntelligence'
import { 
  Layout, 
  Card, 
  Tabs, 
  Badge, 
  Row, 
  Col, 
  Statistic, 
  Alert, 
  Button, 
  Space, 
  Typography, 
  FloatButton,
  List,
  Avatar
} from 'antd'
import { 
  BarChartOutlined, 
  ThunderboltOutlined, 
  SecurityScanOutlined, 
  BankOutlined, 
  SettingOutlined, 
  TeamOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons'

const { Content } = Layout
const { Title, Text } = Typography

type AlertLevel = 'good' | 'warning' | 'critical'

interface TabInfo {
  id: string
  name: string
  icon: React.ReactNode
  alertLevel: AlertLevel
  alertCount: number
}

interface KPI {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  level: AlertLevel
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const tabs: TabInfo[] = [
    { id: 'overview', name: 'Overview', icon: <BarChartOutlined />, alertLevel: 'warning', alertCount: 3 },
    { id: 'performance', name: 'Performance & Analytics', icon: <ThunderboltOutlined />, alertLevel: 'critical', alertCount: 2 },
    { id: 'security', name: 'Security & Compliance', icon: <SecurityScanOutlined />, alertLevel: 'good', alertCount: 0 },
    { id: 'political', name: 'Political Intelligence', icon: <BankOutlined />, alertLevel: 'warning', alertCount: 1 },
    { id: 'operations', name: 'Operations', icon: <SettingOutlined />, alertLevel: 'good', alertCount: 0 },
    { id: 'experience', name: 'User Experience', icon: <TeamOutlined />, alertLevel: 'warning', alertCount: 4 }
  ]

  const mockKPIs: KPI[] = [
    { title: 'Active Users', value: '24,847', change: '+12%', trend: 'up', level: 'good' },
    { title: 'API Response Time', value: '1.2s', change: '+0.3s', trend: 'down', level: 'critical' },
    { title: 'System Uptime', value: '99.8%', change: '-0.1%', trend: 'down', level: 'warning' },
    { title: 'Data Accuracy', value: '97.5%', change: '+1.2%', trend: 'up', level: 'good' }
  ]

  const getAlertBadgeStatus = (level: AlertLevel) => {
    switch (level) {
      case 'critical': return 'error'
      case 'warning': return 'warning'
      case 'good': return 'success'
      default: return 'default'
    }
  }


  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpOutlined style={{ color: '#52c41a' }} />
      case 'down': return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
      case 'stable': return <MinusOutlined style={{ color: '#faad14' }} />
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const renderOverviewTab = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {mockKPIs.map((kpi, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <Statistic
                title={kpi.title}
                value={kpi.value}
                precision={0}
                valueStyle={{ color: kpi.level === 'critical' ? '#ff4d4f' : kpi.level === 'warning' ? '#faad14' : '#52c41a' }}
                prefix={getTrendIcon(kpi.trend)}
                suffix={<Text type="secondary">{kpi.change}</Text>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Critical Alerts" extra={<Badge count={5} status="error" />}>
        <List
          itemLayout="horizontal"
          dataSource={[
            { type: 'error', message: 'API response time exceeded 1s threshold', action: 'Investigate' },
            { type: 'warning', message: 'System uptime below 99.9%', action: 'View Details' },
            { type: 'warning', message: '4 new user experience issues reported', action: 'Review' }
          ]}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" size="small" key="action">
                  {item.action}
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={item.type === 'error' ? <ExclamationCircleOutlined /> : <WarningOutlined />} style={{ backgroundColor: item.type === 'error' ? '#ff4d4f' : '#faad14', color: 'white' }} />}
                description={item.message}
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Quick Actions">
        <Row gutter={[16, 16]}>
          <Col xs={12} md={6}>
            <Button 
              type="dashed" 
              block 
              icon={<TeamOutlined />}
              onClick={() => navigate('/representatives')}
              style={{ height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ marginTop: '8px' }}>Manage Representatives</Text>
            </Button>
          </Col>
          <Col xs={12} md={6}>
            <Button 
              type="dashed" 
              block 
              icon={<BarChartOutlined />}
              onClick={() => navigate('/analytics')}
              style={{ height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ marginTop: '8px' }}>View Analytics</Text>
            </Button>
          </Col>
          <Col xs={12} md={6}>
            <Button 
              type="dashed" 
              block 
              icon={<SecurityScanOutlined />}
              onClick={() => setActiveTab('security')}
              style={{ height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ marginTop: '8px' }}>Security Dashboard</Text>
            </Button>
          </Col>
          <Col xs={12} md={6}>
            <Button 
              type="dashed" 
              block 
              icon={<SettingOutlined />}
              onClick={() => setActiveTab('operations')}
              style={{ height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ marginTop: '8px' }}>System Status</Text>
            </Button>
          </Col>
        </Row>
      </Card>
    </Space>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab()
      case 'performance':
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card>
                  <Statistic
                    title="API Performance"
                    value="1.2s"
                    suffix="avg response"
                    valueStyle={{ color: '#ff4d4f' }}
                    prefix={<ExclamationCircleOutlined />}
                  />
                  <Alert message="Exceeding 1s threshold" type="error" style={{ marginTop: '16px' }} />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card>
                  <Statistic
                    title="User Analytics"
                    value="24,847"
                    suffix="active users"
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<CheckCircleOutlined />}
                  />
                  <Alert message="12% increase from last week" type="success" style={{ marginTop: '16px' }} />
                </Card>
              </Col>
            </Row>
          </Space>
        )
      case 'security':
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="All systems secure"
              description="No security incidents in the last 24 hours"
              type="success"
              showIcon
              icon={<SecurityScanOutlined />}
            />
          </Space>
        )
      case 'political':
        return <PoliticalIntelligence />
      case 'operations':
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="All systems operational"
              description="Uptime: 99.8% | Last backup: 2 hours ago"
              type="success"
              showIcon
              icon={<SettingOutlined />}
            />
          </Space>
        )
      case 'experience':
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card>
                  <Statistic
                    title="App Rating"
                    value="4.2/5"
                    valueStyle={{ color: '#faad14' }}
                    prefix={<WarningOutlined />}
                  />
                  <Alert message="Down from 4.5 last month" type="warning" style={{ marginTop: '16px' }} />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card>
                  <Statistic
                    title="Support Tickets"
                    value="23"
                    suffix="open"
                    valueStyle={{ color: '#faad14' }}
                    prefix={<WarningOutlined />}
                  />
                  <Alert message="4 high priority tickets" type="warning" style={{ marginTop: '16px' }} />
                </Card>
              </Col>
            </Row>
          </Space>
        )
      default:
        return renderOverviewTab()
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={1} style={{ marginBottom: '8px' }}>JanPulse Mission Control</Title>
          <Text type="secondary">
            Welcome back, {user?.email?.split('@')[0]} | Last updated: {lastUpdate.toLocaleTimeString()}
          </Text>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
          items={tabs.map((tab) => ({
            key: tab.id,
            label: (
              <Space>
                {tab.icon}
                <span>{tab.name}</span>
                {tab.alertCount > 0 && (
                  <Badge 
                    count={tab.alertCount} 
                    status={getAlertBadgeStatus(tab.alertLevel)}
                    size="small"
                  />
                )}
              </Space>
            ),
            children: renderTabContent()
          }))}
        />

        <FloatButton
          icon={<ThunderboltOutlined />}
          tooltip="Quick Actions"
          type="primary"
        />
      </Content>
    </Layout>
  )
}

export default Dashboard