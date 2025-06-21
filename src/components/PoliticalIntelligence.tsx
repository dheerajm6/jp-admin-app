import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Select, 
  Space, 
  Typography, 
  Progress,
  Table,
  Tag,
  Badge,
  Alert,
  Divider,
  Spin
} from 'antd'
import { 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import {
  UserOutlined,
  BankOutlined,
  TeamOutlined,
  HeartOutlined,
  TrophyOutlined,
  AlertOutlined,
  RiseOutlined,
  FallOutlined,
  GlobalOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { 
  politicalIntelligenceService,
  RepresentativeStats,
  ConstituencyStats,
  PartyWorkerStats,
  SentimentData,
  EngagementMetrics
} from '../services/politicalIntelligenceService'

const { Title, Text } = Typography

interface DemographicsData {
  name: string
  value: number
  color: string
}



const PoliticalIntelligence: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('all')
  const [selectedParty, setSelectedParty] = useState<string>('all')
  const [selectedGender, setSelectedGender] = useState<string>('all')
  const [pieChartView, setPieChartView] = useState<'type' | 'rural' | 'urban'>('type')
  
  // State for real data
  const [loading, setLoading] = useState<boolean>(true)
  const [representativeStats, setRepresentativeStats] = useState<RepresentativeStats | null>(null)
  const [constituencyStats, setConstituencyStats] = useState<ConstituencyStats[]>([])
  const [partyWorkersStats, setPartyWorkersStats] = useState<PartyWorkerStats[]>([])
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadDashboardData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load filtered data for pie charts when filters change
  useEffect(() => {
    loadFilteredPieChartData()
  }, [selectedState, selectedParty, selectedGender]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load general metrics without filters
      const [constStats, partyStats, sentiments, engagement] = await Promise.all([
        politicalIntelligenceService.getConstituencyStats(),
        politicalIntelligenceService.getPartyWorkerStats(),
        politicalIntelligenceService.getSentimentData(),
        politicalIntelligenceService.getEngagementMetrics()
      ])

      setConstituencyStats(constStats)
      setPartyWorkersStats(partyStats)
      setSentimentData(sentiments)
      setEngagementMetrics(engagement)

      // Load initial pie chart data
      await loadFilteredPieChartData()
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFilteredPieChartData = async () => {
    try {
      const filters = {
        state: selectedState,
        party: selectedParty,
        gender: selectedGender
      }

      const repStats = await politicalIntelligenceService.getRepresentativeStats(filters)
      setRepresentativeStats(repStats)
    } catch (error) {
      console.error('Error loading filtered pie chart data:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }

  // Process data for charts
  const representativeTypes: DemographicsData[] = representativeStats?.by_type.map((item, index) => ({
    name: item.type,
    value: item.count,
    color: ['#8b5cf6', '#3b82f6', '#10b981'][index] || '#fa8c16'
  })) || []

  // Rural/Urban data from service
  const ruralUrbanDistribution: DemographicsData[] = representativeStats?.by_area.map((item, index) => ({
    name: item.area,
    value: item.count,
    color: ['#10b981', '#3b82f6'][index] || '#9ca3af'
  })) || []

  // Get current pie chart data based on selected view
  const getCurrentPieChartData = (): DemographicsData[] => {
    switch (pieChartView) {
      case 'type':
        return representativeTypes
      case 'rural':
        return ruralUrbanDistribution.filter(item => item.name === 'Rural')
      case 'urban':
        return ruralUrbanDistribution.filter(item => item.name === 'Urban')
      default:
        return representativeTypes
    }
  }

  const getCurrentPieChartTitle = (): string => {
    switch (pieChartView) {
      case 'type':
        return 'Representatives by Type'
      case 'rural':
        return 'Rural Representatives'
      case 'urban':
        return 'Urban Representatives'
      default:
        return 'Representatives by Type'
    }
  }

  // Calculate totals for summary metrics (unfiltered data)
  // const totalConstituencies = constituencyStats.reduce((sum, state) => sum + state.total_constituencies, 0)
  const totalCoveredConstituencies = constituencyStats.reduce((sum, state) => sum + state.covered_constituencies, 0)
  const totalRepresentatives = totalCoveredConstituencies // Representatives equal covered constituencies
  const totalActiveWorkers = partyWorkersStats.reduce((sum, party) => sum + party.active_workers, 0)
  const totalSentiments = sentimentData.reduce((sum, data) => sum + data.total_sentiments, 0)
  const averageCoverage = constituencyStats.length > 0 
    ? Math.round(constituencyStats.reduce((sum, state) => sum + state.coverage_percentage, 0) / constituencyStats.length)
    : 0

  // Filtered totals for pie chart display (based on current filters)
  const filteredRepresentatives = representativeStats?.total || 0

  // Calculate sentiment totals
  const totalPositive = sentimentData.reduce((sum, data) => sum + data.positive, 0)
  const totalNeutral = sentimentData.reduce((sum, data) => sum + data.neutral, 0)
  const totalNegative = sentimentData.reduce((sum, data) => sum + data.negative, 0)
  const sentimentTotal = totalPositive + totalNeutral + totalNegative

  const renderInteractivePieChart = () => (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{getCurrentPieChartTitle()}</span>
          <Space>
            <Select
              value={pieChartView}
              onChange={setPieChartView}
              style={{ width: 120 }}
              size="small"
            >
              <Select.Option value="type">By Type</Select.Option>
              <Select.Option value="rural">Rural</Select.Option>
              <Select.Option value="urban">Urban</Select.Option>
            </Select>
          </Space>
        </div>
      }
      extra={
        <Space>
          <Select 
            value={selectedState}
            onChange={setSelectedState}
            style={{ width: 120 }}
            size="small"
          >
            <Select.Option value="all">All States</Select.Option>
            <Select.Option value="karnataka">Karnataka</Select.Option>
            <Select.Option value="tamilnadu">Tamil Nadu</Select.Option>
            <Select.Option value="andhra">Andhra Pradesh</Select.Option>
            <Select.Option value="telangana">Telangana</Select.Option>
            <Select.Option value="kerala">Kerala</Select.Option>
          </Select>
          <Select 
            value={selectedParty}
            onChange={setSelectedParty}
            style={{ width: 100 }}
            size="small"
          >
            <Select.Option value="all">All Parties</Select.Option>
            <Select.Option value="bjp">BJP</Select.Option>
            <Select.Option value="congress">Congress</Select.Option>
            <Select.Option value="jds">JD(S)</Select.Option>
            <Select.Option value="others">Others</Select.Option>
          </Select>
          <Select 
            value={selectedGender}
            onChange={setSelectedGender}
            style={{ width: 100 }}
            size="small"
          >
            <Select.Option value="all">All Genders</Select.Option>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Space>
      }
      style={{ height: '450px' }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Alert
          message={`Showing ${filteredRepresentatives} representatives`}
          description={`Filters: ${selectedState === 'all' ? 'All States' : selectedState}, ${selectedParty === 'all' ? 'All Parties' : selectedParty}, ${selectedGender === 'all' ? 'All Genders' : selectedGender}`}
          type="info"
          showIcon
          style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={getCurrentPieChartData()}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
          >
            {getCurrentPieChartData().map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )

  const constituencyColumns = [
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Total Constituencies',
      dataIndex: 'total_constituencies',
      key: 'total_constituencies',
      render: (value: number) => <Text strong>{value}</Text>
    },
    {
      title: 'Covered',
      dataIndex: 'covered_constituencies',
      key: 'covered_constituencies',
      render: (value: number) => <Tag color="green">{value}</Tag>
    },
    {
      title: 'Coverage %',
      dataIndex: 'coverage_percentage',
      key: 'coverage_percentage',
      render: (value: number) => (
        <Progress 
          percent={value} 
          size="small" 
          strokeColor={value >= 90 ? '#52c41a' : value >= 75 ? '#faad14' : '#ff4d4f'}
        />
      )
    },
    {
      title: 'Representatives',
      dataIndex: 'representatives',
      key: 'representatives',
      render: (value: number) => <Badge count={value} color="blue" />
    }
  ]

  const partyWorkersColumns = [
    {
      title: 'Party',
      dataIndex: 'party',
      key: 'party',
      render: (party: string) => <Tag color="blue">{party}</Tag>
    },
    {
      title: 'Total Workers',
      dataIndex: 'total_workers',
      key: 'total_workers',
      render: (value: number) => value.toLocaleString()
    },
    {
      title: 'Active',
      dataIndex: 'active_workers',
      key: 'active_workers',
      render: (value: number) => <Tag color="green">{value.toLocaleString()}</Tag>
    },
    {
      title: 'Inactive',
      dataIndex: 'inactive_workers',
      key: 'inactive_workers',
      render: (value: number) => <Tag color="red">{value.toLocaleString()}</Tag>
    },
    {
      title: 'Activity Rate',
      dataIndex: 'activity_rate',
      key: 'activity_rate',
      render: (value: number) => (
        <Progress 
          percent={value} 
          size="small" 
          strokeColor={value >= 85 ? '#52c41a' : value >= 70 ? '#faad14' : '#ff4d4f'}
        />
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* Header with Filters */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>Political Intelligence Dashboard</Title>
            <Text type="secondary">Comprehensive political analytics and insights</Text>
          </Col>
        </Row>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Representatives"
              value={totalRepresentatives}
              prefix={<UserOutlined style={{ color: '#8b5cf6' }} />}
              suffix={
                <span style={{ fontSize: '14px', color: '#10b981' }}>
                  ↑ 12 this month
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Constituency Coverage"
              value={averageCoverage}
              suffix="%"
              prefix={<GlobalOutlined style={{ color: '#3b82f6' }} />}
              valueStyle={{ color: averageCoverage >= 90 ? '#52c41a' : averageCoverage >= 75 ? '#faad14' : '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Party Workers"
              value={totalActiveWorkers}
              prefix={<TeamOutlined style={{ color: '#10b981' }} />}
              suffix={
                <span style={{ fontSize: '14px', color: '#10b981' }}>
                  {partyWorkersStats.length > 0 ? Math.round(partyWorkersStats.reduce((sum, p) => sum + p.activity_rate, 0) / partyWorkersStats.length) : 0}% active rate
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sentiments Collected"
              value={totalSentiments}
              prefix={<HeartOutlined style={{ color: '#f59e0b' }} />}
              suffix={
                <span style={{ fontSize: '14px', color: '#10b981' }}>
                  ↑ 15% this week
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Interactive Demographics Chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          {renderInteractivePieChart()}
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Representative Summary" style={{ height: '450px' }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic
                  title="Total Filtered Representatives"
                  value={filteredRepresentatives}
                  prefix={<UserOutlined style={{ color: '#8b5cf6' }} />}
                  valueStyle={{ fontSize: '32px', color: '#8b5cf6' }}
                />
              </Col>
              <Col span={24}>
                <Divider />
                <Title level={5} style={{ marginBottom: '16px' }}>Data Breakdown</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {getCurrentPieChartData().map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 12px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '6px',
                      border: `2px solid ${item.color}`
                    }}>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      <Badge 
                        count={item.value} 
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  ))}
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Constituency Coverage */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Constituency Coverage by State" extra={<Tag color="green">Live Data</Tag>}>
            <Table 
              columns={constituencyColumns}
              dataSource={constituencyStats}
              pagination={false}
              rowKey="state"
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Coverage Summary">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic
                  title="Average Coverage"
                  value={averageCoverage}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: averageCoverage >= 90 ? '#52c41a' : averageCoverage >= 75 ? '#faad14' : '#ff4d4f' }}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title="Total Constituencies"
                  value={constituencyStats.reduce((sum, state) => sum + state.total_constituencies, 0)}
                  prefix={<BankOutlined />}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title="Covered Constituencies"
                  value={constituencyStats.reduce((sum, state) => sum + state.covered_constituencies, 0)}
                  prefix={<TrophyOutlined style={{ color: '#10b981' }} />}
                />
              </Col>
              <Col span={24}>
                <Alert
                  message={`${constituencyStats.reduce((sum, state) => sum + (state.total_constituencies - state.covered_constituencies), 0)} constituencies need attention`}
                  type="warning"
                  showIcon
                  icon={<AlertOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Party Workers Analytics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Party Workers Analytics" extra={<Tag color="blue">Real-time</Tag>}>
            <Table 
              columns={partyWorkersColumns}
              dataSource={partyWorkersStats}
              pagination={false}
              rowKey="party"
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Workers Summary">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic
                  title="Total Workers"
                  value={partyWorkersStats.reduce((sum, party) => sum + party.total_workers, 0)}
                  prefix={<TeamOutlined />}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title="Active Workers"
                  value={totalActiveWorkers}
                  prefix={<RiseOutlined style={{ color: '#10b981' }} />}
                  suffix={
                    <span style={{ fontSize: '14px', color: '#10b981' }}>
                      {partyWorkersStats.length > 0 ? Math.round(partyWorkersStats.reduce((sum, p) => sum + p.activity_rate, 0) / partyWorkersStats.length) : 0}% active
                    </span>
                  }
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title="Inactive Workers"
                  value={partyWorkersStats.reduce((sum, party) => sum + party.inactive_workers, 0)}
                  prefix={<FallOutlined style={{ color: '#ff4d4f' }} />}
                  suffix={
                    <span style={{ fontSize: '14px', color: '#ff4d4f' }}>
                      {partyWorkersStats.length > 0 ? 100 - Math.round(partyWorkersStats.reduce((sum, p) => sum + p.activity_rate, 0) / partyWorkersStats.length) : 0}% inactive
                    </span>
                  }
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Sentiment Analysis */}
      <Card title="Sentiment Analysis Trends" extra={<Tag color="purple">Weekly Analysis</Tag>}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sentimentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="positive" stackId="1" stroke="#10b981" fill="#10b981" />
            <Area type="monotone" dataKey="neutral" stackId="1" stroke="#6b7280" fill="#6b7280" />
            <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="#ef4444" />
          </AreaChart>
        </ResponsiveContainer>
        <Divider />
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Statistic
              title="Positive Sentiments"
              value={totalPositive}
              prefix={<HeartOutlined style={{ color: '#10b981' }} />}
              suffix={
                <span style={{ fontSize: '14px', color: '#10b981' }}>
                  {sentimentTotal > 0 ? Math.round((totalPositive / sentimentTotal) * 100) : 0}% of total
                </span>
              }
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Neutral Sentiments"
              value={totalNeutral}
              prefix={<CalendarOutlined style={{ color: '#6b7280' }} />}
              suffix={
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {sentimentTotal > 0 ? Math.round((totalNeutral / sentimentTotal) * 100) : 0}% of total
                </span>
              }
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Negative Sentiments"
              value={totalNegative}
              prefix={<AlertOutlined style={{ color: '#ef4444' }} />}
              suffix={
                <span style={{ fontSize: '14px', color: '#ef4444' }}>
                  {sentimentTotal > 0 ? Math.round((totalNegative / sentimentTotal) * 100) : 0}% of total
                </span>
              }
            />
          </Col>
        </Row>
      </Card>

      {/* Engagement Metrics */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Engagement Metrics" extra={<Tag color="orange">Live Tracking</Tag>}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card size="small">
                  <Statistic
                    title="Social Media Activity"
                    value={engagementMetrics?.social_media_activity || 0}
                    suffix="% active"
                    prefix={<HeartOutlined style={{ color: '#3b82f6' }} />}
                    valueStyle={{ 
                      color: (engagementMetrics?.social_media_activity || 0) >= 80 ? '#52c41a' : 
                             (engagementMetrics?.social_media_activity || 0) >= 60 ? '#faad14' : '#ff4d4f' 
                    }}
                  />
                  <Progress 
                    percent={engagementMetrics?.social_media_activity || 0} 
                    size="small"
                    strokeColor={(engagementMetrics?.social_media_activity || 0) >= 80 ? '#52c41a' : 
                                (engagementMetrics?.social_media_activity || 0) >= 60 ? '#faad14' : '#ff4d4f'}
                    style={{ marginTop: '8px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card size="small">
                  <Statistic
                    title="Public Response Rate"
                    value={engagementMetrics?.public_response_rate || 0}
                    suffix="% response"
                    prefix={<TeamOutlined style={{ color: '#10b981' }} />}
                    valueStyle={{ 
                      color: (engagementMetrics?.public_response_rate || 0) >= 80 ? '#52c41a' : 
                             (engagementMetrics?.public_response_rate || 0) >= 60 ? '#faad14' : '#ff4d4f' 
                    }}
                  />
                  <Progress 
                    percent={engagementMetrics?.public_response_rate || 0} 
                    size="small"
                    strokeColor={(engagementMetrics?.public_response_rate || 0) >= 80 ? '#52c41a' : 
                                (engagementMetrics?.public_response_rate || 0) >= 60 ? '#faad14' : '#ff4d4f'}
                    style={{ marginTop: '8px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card size="small">
                  <Statistic
                    title="Meeting Attendance"
                    value={engagementMetrics?.meeting_attendance || 0}
                    suffix="% attendance"
                    prefix={<CalendarOutlined style={{ color: '#8b5cf6' }} />}
                    valueStyle={{ 
                      color: (engagementMetrics?.meeting_attendance || 0) >= 80 ? '#52c41a' : 
                             (engagementMetrics?.meeting_attendance || 0) >= 60 ? '#faad14' : '#ff4d4f' 
                    }}
                  />
                  <Progress 
                    percent={engagementMetrics?.meeting_attendance || 0} 
                    size="small"
                    strokeColor={(engagementMetrics?.meeting_attendance || 0) >= 80 ? '#52c41a' : 
                                (engagementMetrics?.meeting_attendance || 0) >= 60 ? '#faad14' : '#ff4d4f'}
                    style={{ marginTop: '8px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card size="small">
                  <Statistic
                    title="Scheme Participation"
                    value={engagementMetrics?.scheme_participation || 0}
                    suffix="% participation"
                    prefix={<TrophyOutlined style={{ color: '#f59e0b' }} />}
                    valueStyle={{ 
                      color: (engagementMetrics?.scheme_participation || 0) >= 80 ? '#52c41a' : 
                             (engagementMetrics?.scheme_participation || 0) >= 60 ? '#faad14' : '#ff4d4f' 
                    }}
                  />
                  <Progress 
                    percent={engagementMetrics?.scheme_participation || 0} 
                    size="small"
                    strokeColor={(engagementMetrics?.scheme_participation || 0) >= 80 ? '#52c41a' : 
                                (engagementMetrics?.scheme_participation || 0) >= 60 ? '#faad14' : '#ff4d4f'}
                    style={{ marginTop: '8px' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Performance Insights" extra={<Tag color="purple">AI Powered</Tag>}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Alert
                message="High Engagement"
                description={`Social media activity is ${(engagementMetrics?.social_media_activity || 0) >= 80 ? 'excellent' : (engagementMetrics?.social_media_activity || 0) >= 60 ? 'good' : 'needs improvement'} at ${engagementMetrics?.social_media_activity || 0}%`}
                type={(engagementMetrics?.social_media_activity || 0) >= 80 ? 'success' : (engagementMetrics?.social_media_activity || 0) >= 60 ? 'warning' : 'error'}
                showIcon
              />
              <Alert
                message="Public Response"
                description={`Citizens are ${(engagementMetrics?.public_response_rate || 0) >= 70 ? 'actively responding' : 'less engaged'} with ${engagementMetrics?.public_response_rate || 0}% response rate`}
                type={(engagementMetrics?.public_response_rate || 0) >= 70 ? 'success' : 'warning'}
                showIcon
              />
              <Alert
                message="Meeting Participation"
                description={`Representative attendance at ${engagementMetrics?.meeting_attendance || 0}% - ${(engagementMetrics?.meeting_attendance || 0) >= 75 ? 'Good participation' : 'Needs improvement'}`}
                type={(engagementMetrics?.meeting_attendance || 0) >= 75 ? 'success' : 'warning'}
                showIcon
              />
              <Alert
                message="Scheme Effectiveness"
                description={`Government schemes showing ${engagementMetrics?.scheme_participation || 0}% participation rate`}
                type={(engagementMetrics?.scheme_participation || 0) >= 85 ? 'success' : (engagementMetrics?.scheme_participation || 0) >= 70 ? 'warning' : 'error'}
                showIcon
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PoliticalIntelligence