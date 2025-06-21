import React, { useState } from 'react'
import { Card, Row, Col, Typography, Select, DatePicker, Space, Table, Tag, Button, Tabs, Badge } from 'antd'
import { 
  DownloadOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generated')

  // Sample generated reports data
  const generatedReports = [
    {
      id: 1,
      name: 'Monthly Representative Activity Report',
      type: 'activity',
      generatedDate: '2024-01-10',
      size: '2.4 MB',
      format: 'PDF',
      status: 'ready',
      description: 'Comprehensive overview of representative activities for December 2023'
    },
    {
      id: 2,
      name: 'Constituency Voter Statistics',
      type: 'statistics',
      generatedDate: '2024-01-09',
      size: '1.8 MB',
      format: 'Excel',
      status: 'ready',
      description: 'Detailed voter demographics and statistics by constituency'
    },
    {
      id: 3,
      name: 'Government Schemes Utilization Report',
      type: 'schemes',
      generatedDate: '2024-01-08',
      size: '3.1 MB',
      format: 'PDF',
      status: 'ready',
      description: 'Analysis of scheme adoption and beneficiary data'
    },
    {
      id: 4,
      name: 'Quarterly Performance Summary',
      type: 'performance',
      generatedDate: '2024-01-05',
      size: '5.2 MB',
      format: 'PDF',
      status: 'processing',
      description: 'Q4 2023 platform performance metrics and KPIs'
    }
  ]

  // Report templates
  const reportTemplates = [
    {
      id: 1,
      name: 'Representative Activity Report',
      description: 'Track representative engagement and activities',
      icon: <FileTextOutlined />,
      frequency: 'Monthly',
      lastGenerated: '2024-01-10'
    },
    {
      id: 2,
      name: 'Voter Demographics Report',
      description: 'Analyze voter distribution and demographics',
      icon: <FileTextOutlined />,
      frequency: 'Quarterly',
      lastGenerated: '2023-12-15'
    },
    {
      id: 3,
      name: 'Scheme Performance Report',
      description: 'Evaluate government scheme effectiveness',
      icon: <FileTextOutlined />,
      frequency: 'Monthly',
      lastGenerated: '2024-01-08'
    },
    {
      id: 4,
      name: 'Platform Usage Report',
      description: 'Monitor system usage and performance',
      icon: <FileTextOutlined />,
      frequency: 'Weekly',
      lastGenerated: '2024-01-12'
    }
  ]

  const columns = [
    {
      title: 'Report Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space direction="vertical" size="small">
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.description}</Text>
        </Space>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeColors: any = {
          activity: 'blue',
          statistics: 'green',
          schemes: 'purple',
          performance: 'orange'
        }
        return <Tag color={typeColors[type]}>{type.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Generated',
      dataIndex: 'generatedDate',
      key: 'generatedDate',
      render: (date: string) => (
        <Space>
          <CalendarOutlined />
          {date}
        </Space>
      )
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: (format: string) => (
        <Space>
          {format === 'PDF' ? <FilePdfOutlined style={{ color: '#ef4444' }} /> : <FileExcelOutlined style={{ color: '#10b981' }} />}
          {format}
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'ready' ? 'success' : 'processing'} 
          text={status === 'ready' ? 'Ready' : 'Processing'}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<DownloadOutlined />}
            disabled={record.status === 'processing'}
          >
            Download
          </Button>
        </Space>
      )
    }
  ]

  const tabItems = [
    {
      key: 'generated',
      label: 'Generated Reports',
      children: (
        <Table 
          columns={columns} 
          dataSource={generatedReports} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )
    },
    {
      key: 'templates',
      label: 'Report Templates',
      children: (
        <Row gutter={[16, 16]}>
          {reportTemplates.map((template) => (
            <Col xs={24} sm={12} lg={6} key={template.id}>
              <Card hoverable>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ fontSize: '32px', color: '#8b5cf6' }}>{template.icon}</div>
                  <Title level={4} style={{ margin: 0 }}>{template.name}</Title>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{template.description}</Text>
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginTop: '12px' }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Frequency:</Text>
                        <Tag>{template.frequency}</Tag>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Last Generated:</Text>
                        <Text style={{ fontSize: '12px' }}>{template.lastGenerated}</Text>
                      </div>
                    </Space>
                  </div>
                  <Button 
                    type="primary" 
                    block 
                    style={{ 
                      marginTop: '12px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                      border: 'none'
                    }}
                  >
                    Generate Report
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>Reports</Title>
            <Text type="secondary">Generate and download system reports</Text>
          </Col>
          <Col>
            <Space>
              <Select defaultValue="all" style={{ width: 150 }}>
                <Select.Option value="all">All Reports</Select.Option>
                <Select.Option value="activity">Activity Reports</Select.Option>
                <Select.Option value="statistics">Statistics Reports</Select.Option>
                <Select.Option value="schemes">Scheme Reports</Select.Option>
              </Select>
              <RangePicker />
            </Space>
          </Col>
        </Row>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FileTextOutlined style={{ fontSize: '24px' }} />
              </div>
              <div>
                <Text type="secondary">Total Reports</Text>
                <Title level={3} style={{ margin: 0 }}>124</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: '#f3f4f6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}>
                <CheckCircleOutlined style={{ fontSize: '24px' }} />
              </div>
              <div>
                <Text type="secondary">Generated Today</Text>
                <Title level={3} style={{ margin: 0 }}>8</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: '#f3f4f6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b'
              }}>
                <SyncOutlined style={{ fontSize: '24px' }} spin />
              </div>
              <div>
                <Text type="secondary">Processing</Text>
                <Title level={3} style={{ margin: 0 }}>3</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: '#f3f4f6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280'
              }}>
                <ClockCircleOutlined style={{ fontSize: '24px' }} />
              </div>
              <div>
                <Text type="secondary">Scheduled</Text>
                <Title level={3} style={{ margin: 0 }}>12</Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Tabs for Reports */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  )
}

export default Reports