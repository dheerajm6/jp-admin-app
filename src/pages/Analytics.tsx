import React from 'react'
import { Card, Row, Col, Statistic, Progress, Typography, Select, DatePicker, Space, Table, Tag } from 'antd'
import { 
  UserOutlined, 
  TeamOutlined, 
  RiseOutlined, 
  CheckCircleOutlined,
  LineChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  DownloadOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const Analytics: React.FC = () => {
  const performanceData = [
    { metric: 'User Registrations', value: 1234, growth: 12.5, icon: <UserOutlined /> },
    { metric: 'Active Representatives', value: 89, growth: 5.2, icon: <TeamOutlined /> },
    { metric: 'Schemes Uploaded', value: 456, growth: 18.9, icon: <RiseOutlined /> },
    { metric: 'Requests Processed', value: 789, growth: -2.3, icon: <CheckCircleOutlined /> },
  ]

  const topConstituencies = [
    { name: 'Bengaluru North', representatives: 12, voters: 234567, schemes: 45 },
    { name: 'Mysuru City', representatives: 10, voters: 198765, schemes: 38 },
    { name: 'Mangaluru', representatives: 9, voters: 187654, schemes: 42 },
    { name: 'Hubballi-Dharwad', representatives: 8, voters: 176543, schemes: 35 },
    { name: 'Kalaburagi', representatives: 7, voters: 165432, schemes: 31 },
  ]

  const columns = [
    {
      title: 'Constituency',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Representatives',
      dataIndex: 'representatives',
      key: 'representatives',
      render: (text: number) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Registered Voters',
      dataIndex: 'voters',
      key: 'voters',
      render: (text: number) => text.toLocaleString(),
    },
    {
      title: 'Active Schemes',
      dataIndex: 'schemes',
      key: 'schemes',
      render: (text: number) => <Tag color="green">{text}</Tag>,
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>Analytics</Title>
            <Text type="secondary">Monitor platform performance and insights</Text>
          </Col>
          <Col>
            <Space>
              <Select defaultValue="all" style={{ width: 150 }}>
                <Select.Option value="all">All Regions</Select.Option>
                <Select.Option value="north">North Karnataka</Select.Option>
                <Select.Option value="south">South Karnataka</Select.Option>
              </Select>
              <RangePicker />
              <button 
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <DownloadOutlined /> Export Report
              </button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {performanceData.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable>
              <Statistic
                title={item.metric}
                value={item.value}
                prefix={<span style={{ color: '#8b5cf6' }}>{item.icon}</span>}
                suffix={
                  <span style={{ 
                    fontSize: '14px', 
                    color: item.growth > 0 ? '#10b981' : '#ef4444' 
                  }}>
                    {item.growth > 0 ? '↑' : '↓'} {Math.abs(item.growth)}%
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <LineChartOutlined style={{ color: '#8b5cf6' }} />
                Registration Trends
              </Space>
            }
            extra={
              <Select defaultValue="monthly" size="small">
                <Select.Option value="daily">Daily</Select.Option>
                <Select.Option value="weekly">Weekly</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
              </Select>
            }
          >
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              Chart placeholder - Integration with chart library needed
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <PieChartOutlined style={{ color: '#8b5cf6' }} />
                User Distribution
              </Space>
            }
          >
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
              <div>
                <Text>MLAs</Text>
                <Progress percent={45} strokeColor="#8b5cf6" />
              </div>
              <div>
                <Text>MLCs</Text>
                <Progress percent={30} strokeColor="#a855f7" />
              </div>
              <div>
                <Text>MPs</Text>
                <Progress percent={25} strokeColor="#c084fc" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Top Constituencies Table */}
      <Card 
        title={
          <Space>
            <BarChartOutlined style={{ color: '#8b5cf6' }} />
            Top Performing Constituencies
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={topConstituencies} 
          pagination={false}
          rowKey="name"
        />
      </Card>
    </div>
  )
}

export default Analytics