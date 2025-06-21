import React, { useState } from 'react'
import { Card, Tabs, Row, Col, Statistic } from 'antd'
import { UploadOutlined, FileTextOutlined, TableOutlined, EnvironmentOutlined, BarChartOutlined } from '@ant-design/icons'
import RepresentativesUpload from '../components/uploads/RepresentativesUpload'
import SchemesUpload from '../components/uploads/SchemesUpload'
import PollingUpload from '../components/uploads/PollingUpload'

interface UploadStats {
  totalUploads: number
  successfulUploads: number
  failedUploads: number
  lastUpload: string
}

const DataUploads: React.FC = () => {
  const [uploadStats] = useState<UploadStats>({
    totalUploads: 47,
    successfulUploads: 42,
    failedUploads: 5,
    lastUpload: '2 hours ago'
  })

  const tabs = [
    {
      key: 'representatives',
      label: (
        <span>
          <TableOutlined />
          Representatives
        </span>
      ),
      children: <RepresentativesUpload />
    },
    {
      key: 'schemes',
      label: (
        <span>
          <FileTextOutlined />
          Government Schemes
        </span>
      ),
      children: <SchemesUpload />
    },
    {
      key: 'polling',
      label: (
        <span>
          <BarChartOutlined />
          Polling Information
        </span>
      ),
      children: <PollingUpload />
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Data Management Center</h1>
          <p style={{ color: '#666', fontSize: '16px' }}>Upload and manage representatives, schemes, and polling information</p>
        </div>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="Total Uploads" 
                value={uploadStats.totalUploads} 
                prefix={<UploadOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="Successful" 
                value={uploadStats.successfulUploads} 
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="Failed" 
                value={uploadStats.failedUploads} 
                prefix={<EnvironmentOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="Last Upload" 
                value={uploadStats.lastUpload} 
                valueStyle={{ fontSize: '16px' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card>
        <Tabs 
          defaultActiveKey="representatives"
          size="large"
          items={tabs}
        />
      </Card>
    </div>
  )
}

export default DataUploads