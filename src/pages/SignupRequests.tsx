import React from 'react'
import { Card, Table, Button, Badge, Space, Input, Select, Tag, Row, Col, Statistic } from 'antd'
import { 
  TeamOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  WarningOutlined
} from '@ant-design/icons'

const { Search } = Input

const SignupRequests: React.FC = () => {
  const stats = {
    total: 4,
    pending: 2,
    underReview: 1,
    approved: 1,
    rejected: 0,
    conflicted: 4
  }

  const mockData = [
    {
      key: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      constituency: 'Mumbai Central',
      state: 'Maharashtra',
      party: 'BJP',
      type: 'Ex-MLA',
      status: 'pending',
      priority: 'high'
    },
    {
      key: '2', 
      name: 'Amit Singh',
      email: 'amit.singh@example.com',
      constituency: 'Delhi Cantonment',
      state: 'Delhi',
      party: 'AAP',
      type: 'Opposition',
      status: 'under_review',
      priority: 'medium'
    }
  ]

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Constituency',
      dataIndex: 'constituency',
      key: 'constituency',
    },
    {
      title: 'Party',
      dataIndex: 'party',
      key: 'party',
      render: (party: string) => <Tag color="blue">{party}</Tag>
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = {
          pending: { color: 'orange', icon: <ClockCircleOutlined /> },
          approved: { color: 'green', icon: <CheckCircleOutlined /> },
          rejected: { color: 'red', icon: <CloseCircleOutlined /> },
          under_review: { color: 'blue', icon: <EyeOutlined /> }
        }
        const { color } = config[status as keyof typeof config] || config.pending
        return <Badge color={color} text={status.replace('_', ' ').toUpperCase()} />
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" icon={<EyeOutlined />}>View</Button>
          <Button type="primary" size="small">Approve</Button>
          <Button danger size="small">Reject</Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            Sign-up Requests Management
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Review and approve representative registration requests with constituency conflicts
          </p>
        </div>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={4}>
            <Card>
              <Statistic 
                title="Total Requests" 
                value={stats.total} 
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card>
              <Statistic 
                title="Pending" 
                value={stats.pending} 
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card>
              <Statistic 
                title="Under Review" 
                value={stats.underReview} 
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card>
              <Statistic 
                title="Approved" 
                value={stats.approved} 
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card>
              <Statistic 
                title="Conflicted" 
                value={stats.conflicted} 
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card>
        <Space style={{ marginBottom: '16px' }}>
          <Search placeholder="Search requests..." style={{ width: 300 }} />
          <Select defaultValue="all" style={{ width: 150 }}>
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="approved">Approved</Select.Option>
            <Select.Option value="rejected">Rejected</Select.Option>
          </Select>
          <Select defaultValue="all" style={{ width: 150 }}>
            <Select.Option value="all">All Types</Select.Option>
            <Select.Option value="ex_mla">Ex-MLA</Select.Option>
            <Select.Option value="opposition">Opposition</Select.Option>
            <Select.Option value="prospecting_mla">Prospecting MLA</Select.Option>
          </Select>
        </Space>

        <Table 
          columns={columns} 
          dataSource={mockData}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )
}

export default SignupRequests