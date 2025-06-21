import React from 'react'
import { Card, Upload, Button, Typography, Tag, Space } from 'antd'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const RepresentativesUpload: React.FC = () => {
  const requiredColumns = [
    'Name', 'Constituency', 'Party', 'Position', 'State', 'Phone', 'Email'
  ]

  const downloadTemplate = () => {
    const csvContent = [
      'Name,Constituency,Party,Position,State,Phone,Email',
      'John Doe,Mumbai Central,INC,MLA,Maharashtra,9876543210,john@example.com',
      'Jane Smith,Delhi Cantonment,BJP,MP,Delhi,9876543211,jane@example.com'
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'representatives_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={3}>Representatives Upload</Title>
          <Paragraph>Upload CSV or Excel files containing MLAs, MLCs, and MPs data</Paragraph>
          
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
              <Tag key={col} color="blue">{col}</Tag>
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
            <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">Click or drag files to this area to upload</p>
          <p className="ant-upload-hint">
            Supports CSV, XLS, XLSX files up to 10MB. You can upload multiple files at once.
          </p>
        </Upload.Dragger>
      </Space>
    </Card>
  )
}

export default RepresentativesUpload