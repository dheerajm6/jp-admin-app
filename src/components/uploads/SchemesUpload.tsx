import React from 'react'
import { Card, Upload, Button, Typography, Tag, Space } from 'antd'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const SchemesUpload: React.FC = () => {
  const requiredColumns = [
    'Scheme Name', 'Category', 'Description', 'Beneficiary Type', 'Budget Amount', 'Status', 'Launch Date', 'End Date'
  ]

  const downloadTemplate = () => {
    const csvContent = [
      'Scheme Name,Category,Description,Beneficiary Type,Budget Amount,Status,Launch Date,End Date',
      'PM Kisan Samman Nidhi,Agriculture,Financial support to farmers,Farmers,75000,Active,2019-02-24,2024-12-31',
      'Ayushman Bharat,Health,Health insurance for poor families,BPL Families,6400,Active,2018-09-23,2025-03-31'
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schemes_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={3}>Government Schemes Upload</Title>
          <Paragraph>Upload CSV or Excel files containing government schemes and programs data</Paragraph>
          
          <Button 
            icon={<DownloadOutlined />} 
            onClick={downloadTemplate}
            style={{ marginBottom: '16px' }}
          >
            Download Template
          </Button>
        </div>

        <div>
          <Title level={5}>Required Columns:</Title>
          <Space wrap>
            {requiredColumns.map(col => (
              <Tag key={col} color="green">{col}</Tag>
            ))}
          </Space>
        </div>

        <Upload.Dragger
          name="files"
          multiple
          accept=".csv,.xls,.xlsx"
          showUploadList={{ showRemoveIcon: true }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
          </p>
          <p className="ant-upload-text">Click or drag files to this area to upload</p>
          <p className="ant-upload-hint">
            Supports CSV, XLS, XLSX files up to 15MB. Upload government schemes and programs data.
          </p>
        </Upload.Dragger>
      </Space>
    </Card>
  )
}

export default SchemesUpload