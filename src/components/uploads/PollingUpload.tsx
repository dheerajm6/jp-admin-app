import React from 'react'
import { Card, Upload, Button, Typography, Tag, Space, Row, Col } from 'antd'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const PollingUpload: React.FC = () => {
  const requiredColumns = {
    stations: ['Station ID', 'Station Name', 'Address', 'Constituency', 'District', 'State', 'Booth Type', 'Capacity'],
    voters: ['Voter ID', 'Name', 'Age', 'Gender', 'Address', 'Constituency', 'Polling Station', 'Status'],
    results: ['Constituency', 'Candidate Name', 'Party', 'Votes', 'Vote Share', 'Position', 'Status']
  }

  const downloadTemplate = (type: 'stations' | 'voters' | 'results') => {
    const templates = {
      stations: [
        'Station ID,Station Name,Address,Constituency,District,State,Booth Type,Capacity',
        '001,Government School,123 Main Street,Mumbai Central,Mumbai,Maharashtra,Regular,1200'
      ],
      voters: [
        'Voter ID,Name,Age,Gender,Address,Constituency,Polling Station,Status',
        'ABC1234567,Rajesh Kumar,35,Male,12 Gandhi Nagar,Mumbai Central,001,Active'
      ],
      results: [
        'Constituency,Candidate Name,Party,Votes,Vote Share,Position,Status',
        'Mumbai Central,Rahul Verma,INC,45230,38.2%,1,Winner'
      ]
    }
    
    const csvContent = templates[type].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}_template.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={3}>Polling Information Upload</Title>
          <Paragraph>Upload voter lists, polling stations, and election results data</Paragraph>
          
          <Row gutter={[8, 8]}>
            <Col>
              <Button 
                size="small"
                icon={<DownloadOutlined />} 
                onClick={() => downloadTemplate('stations')}
              >
                Stations Template
              </Button>
            </Col>
            <Col>
              <Button 
                size="small"
                icon={<DownloadOutlined />} 
                onClick={() => downloadTemplate('voters')}
              >
                Voters Template
              </Button>
            </Col>
            <Col>
              <Button 
                size="small"
                icon={<DownloadOutlined />} 
                onClick={() => downloadTemplate('results')}
              >
                Results Template
              </Button>
            </Col>
          </Row>
        </div>

        <div>
          <Title level={5}>Data Types Available:</Title>
          <Space wrap>
            <Tag color="blue">Polling Stations</Tag>
            <Tag color="green">Voter Lists</Tag>
            <Tag color="red">Election Results</Tag>
          </Space>
        </div>

        <Upload.Dragger
          name="files"
          multiple
          accept=".csv,.xls,.xlsx"
          showUploadList={{ showRemoveIcon: true }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: '48px', color: '#faad14' }} />
          </p>
          <p className="ant-upload-text">Click or drag files to this area to upload</p>
          <p className="ant-upload-hint">
            Supports CSV, XLS, XLSX files up to 25MB. File names with 'station', 'voter', or 'result' will be auto-categorized.
          </p>
        </Upload.Dragger>
      </Space>
    </Card>
  )
}

export default PollingUpload