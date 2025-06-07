import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Card, 
  Text, 
  Group, 
  Grid, 
  SimpleGrid,
  ThemeIcon,
  Stack,
  Select,
  Title,
  Flex,
  Box,
  Badge,
  Paper
} from '@mantine/core'
import { 
  IconUsers, 
  IconUserCheck,
  IconHeart,
  IconCar,
  IconTrendingUp,
  IconAnalyze,
  IconChartBar,
  IconDeviceAnalytics
} from '@tabler/icons-react'
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line
} from 'recharts'

interface DashboardMetrics {
  totalAppUsers: number
  activeRepresentatives: number
  totalConstituencies: number
  sentimentsAnalyzed: number
  aiOkrsGenerated: number
  avgSentimentScore: number
  appDownloads: number
  monthlyGrowth: number
}

const ExecutiveDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAppUsers: 2847,
    activeRepresentatives: 1634,
    totalConstituencies: 425,
    sentimentsAnalyzed: 13000,
    aiOkrsGenerated: 234,
    avgSentimentScore: 7.2,
    appDownloads: 15643,
    monthlyGrowth: 12.5
  })

  const [loading, setLoading] = useState(false)
  const [selectedState, setSelectedState] = useState('All States')
  const [selectedParty, setSelectedParty] = useState('All Parties')
  const [selectedGender, setSelectedGender] = useState('All Genders')
  const [selectedLocation, setSelectedLocation] = useState('All Areas')

  // Filter options
  const indianStates = [
    'All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 
    'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 
    'Puducherry', 'Andaman and Nicobar Islands'
  ]

  const parties = ['All Parties', 'BJP', 'INC', 'AAP', 'TMC', 'DMK', 'YSRCP', 'TRS', 'SP', 'BSP', 'JDU', 'RJD', 'Others']
  const genders = ['All Genders', 'Male', 'Female']
  const locations = ['All Areas', 'Urban', 'Rural']

  // Sample data with filters applied
  const representativeTypeDistribution = [
    { name: 'MLAs', value: 312, color: '#7c3aed', gender: { male: 195, female: 117 }, location: { urban: 156, rural: 156 } },
    { name: 'MPs', value: 89, color: '#3b82f6', gender: { male: 67, female: 22 }, location: { urban: 34, rural: 55 } },
    { name: 'MLCs', value: 156, color: '#10b981', gender: { male: 98, female: 58 }, location: { urban: 78, rural: 78 } },
  ]

  const okrTrendsByParty = [
    { month: 'Jan', BJP: 45, INC: 32, AAP: 18, TMC: 25, Others: 35 },
    { month: 'Feb', BJP: 52, INC: 38, AAP: 22, TMC: 30, Others: 42 },
    { month: 'Mar', BJP: 61, INC: 45, AAP: 28, TMC: 35, Others: 48 },
    { month: 'Apr', BJP: 78, INC: 52, AAP: 35, TMC: 42, Others: 55 },
    { month: 'May', BJP: 89, INC: 58, AAP: 42, TMC: 48, Others: 62 },
    { month: 'Jun', BJP: 95, INC: 65, AAP: 48, TMC: 55, Others: 68 },
  ]

  const appUsageTrends = [
    { month: 'Jan', dailyActiveUsers: 245, sessionDuration: 12.5, featuresUsed: 8.2 },
    { month: 'Feb', dailyActiveUsers: 298, sessionDuration: 14.2, featuresUsed: 9.1 },
    { month: 'Mar', dailyActiveUsers: 356, sessionDuration: 15.8, featuresUsed: 10.3 },
    { month: 'Apr', dailyActiveUsers: 423, sessionDuration: 18.2, featuresUsed: 11.5 },
    { month: 'May', dailyActiveUsers: 487, sessionDuration: 19.8, featuresUsed: 12.8 },
    { month: 'Jun', dailyActiveUsers: 542, sessionDuration: 21.3, featuresUsed: 13.9 },
  ]

  const sentimentAnalysis = [
    { category: 'Positive', count: 8420, percentage: 65, color: '#10b981' },
    { category: 'Neutral', count: 3280, percentage: 25, color: '#f59e0b' },
    { category: 'Negative', count: 1300, percentage: 10, color: '#ef4444' },
  ]

  // Theme colors
  const theme = {
    primary: '#7c3aed',
    secondary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      500: '#9ca3af',
      600: '#6b7280',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  }

  const StatCard: React.FC<{
    title: string
    value: string | number
    icon: React.ComponentType<any>
    color: string
    subtitle?: string
    change?: string
  }> = ({ title, value, icon: Icon, color, subtitle, change }) => {
    const colorMap: Record<string, string> = {
      blue: theme.secondary,
      purple: theme.primary,
      green: theme.success,
      orange: theme.warning,
      red: theme.danger
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          shadow="xs" 
          padding="lg" 
          radius="lg"
          style={{ 
            background: 'white',
            border: '1px solid #f1f3f4',
            height: '100%'
          }}
        >
          <Group justify="space-between" mb="md">
            <Box>
              <Text size="xs" style={{ color: theme.gray[500] }} fw={500} mb={4}>
                {title}
              </Text>
              <Text size="lg" fw={600} style={{ color: theme.gray[800] }}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Text>
              {change && (
                <Badge color="green" variant="light" size="sm" mt={4}>
                  {change}
                </Badge>
              )}
              {subtitle && (
                <Text size="xs" style={{ color: theme.gray[600] }} mt={4}>
                  {subtitle}
                </Text>
              )}
            </Box>
            <ThemeIcon
              size={40}
              radius="lg"
              style={{ backgroundColor: `${colorMap[color]}10`, color: colorMap[color] }}
            >
              <Icon size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      </motion.div>
    )
  }

  const ChartCard: React.FC<{
    title: string
    subtitle: string
    children: React.ReactNode
    icon: string
    delay?: number
  }> = ({ title, subtitle, children, icon, delay = 0.3 }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Card 
        shadow="xs" 
        padding="lg" 
        radius="lg"
        style={{ 
          background: 'white',
          border: '1px solid #f1f3f4',
          height: '100%'
        }}
      >
        <Group mb="lg">
          <Text size="md" fw={500} style={{ color: theme.gray[800] }}>
            {icon} {title}
          </Text>
        </Group>
        <Text size="xs" style={{ color: theme.gray[500] }} mb="lg">
          {subtitle}
        </Text>
        {children}
      </Card>
    </motion.div>
  )

  if (loading) {
    return (
      <Flex justify="center" align="center" h={400}>
        <Text>Loading dashboard...</Text>
      </Flex>
    )
  }

  return (
    <Box style={{ backgroundColor: '#fafbfc', minHeight: '100vh', padding: '20px' }}>
      <Stack gap="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Group justify="space-between" mb="lg">
            <Box>
              <Title order={2} mb={4} style={{ color: theme.gray[800], fontWeight: 600 }}>
                Dashboard Overview
              </Title>
              <Text size="sm" style={{ color: theme.gray[500] }}>
                Political analytics & insights
              </Text>
            </Box>
            <Badge size="sm" color="green" variant="dot">
              Live
            </Badge>
          </Group>
        </motion.div>

        {/* KPI Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <StatCard
            title="Total Representatives"
            value={metrics.totalAppUsers}
            icon={IconUsers}
            color="purple"
            subtitle="MLAs: 312 | MPs: 89 | MLCs: 156"
          />
          <StatCard
            title="Total Party Workers"
            value={metrics.appDownloads}
            icon={IconUserCheck}
            color="blue"
            change={`+${metrics.monthlyGrowth}%`}
          />
          <StatCard
            title="Sentiment Analyzed"
            value={metrics.sentimentsAnalyzed}
            icon={IconAnalyze}
            color="green"
            subtitle="AI-powered analysis"
          />
          <StatCard
            title="Active Users"
            value={metrics.activeRepresentatives}
            icon={IconTrendingUp}
            color="orange"
            subtitle="Currently using app"
          />
        </SimpleGrid>

        {/* Main Charts Grid */}
        <Grid>
          {/* Representative Distribution with Filters */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <ChartCard
              title="Representative Distribution"
              subtitle="MLAs, MPs, MLCs breakdown with advanced filtering"
              icon="🏛️"
              delay={0.4}
            >
              {/* Filter Controls */}
              <Paper p="md" radius="lg" mb="xl" style={{ backgroundColor: theme.gray[50] }}>
                <Text size="sm" fw={500} mb="md" style={{ color: theme.gray[700] }}>
                  Filter Options
                </Text>
                <SimpleGrid cols={{ base: 2, md: 4 }} spacing="sm">
                  <Select
                    placeholder="Select State"
                    value={selectedState}
                    onChange={(value) => setSelectedState(value || 'All States')}
                    data={indianStates}
                    size="sm"
                  />
                  <Select
                    placeholder="Select Party"
                    value={selectedParty}
                    onChange={(value) => setSelectedParty(value || 'All Parties')}
                    data={parties}
                    size="sm"
                  />
                  <Select
                    placeholder="Select Gender"
                    value={selectedGender}
                    onChange={(value) => setSelectedGender(value || 'All Genders')}
                    data={genders}
                    size="sm"
                  />
                  <Select
                    placeholder="Select Area"
                    value={selectedLocation}
                    onChange={(value) => setSelectedLocation(value || 'All Areas')}
                    data={locations}
                    size="sm"
                  />
                </SimpleGrid>
              </Paper>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={representativeTypeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    labelLine={false}
                  >
                    {representativeTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid.Col>

          {/* Sentiment Analysis */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <ChartCard
              title="Sentiment Analysis"
              subtitle="AI-powered sentiment distribution from representative feedback"
              icon="💭"
              delay={0.5}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sentimentAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gray[200]} />
                  <XAxis dataKey="category" stroke={theme.gray[600]} />
                  <YAxis stroke={theme.gray[600]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" fill={theme.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid.Col>
        </Grid>

        {/* Secondary Charts Grid */}
        <Grid>
          {/* OKR Trends by Party */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <ChartCard
              title="OKR Trends by Party"
              subtitle="Monthly OKR generation across political parties"
              icon="📈"
              delay={0.6}
            >
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={okrTrendsByParty}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gray[200]} />
                  <XAxis dataKey="month" stroke={theme.gray[600]} />
                  <YAxis stroke={theme.gray[600]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="BJP" stroke="#ff6b35" strokeWidth={3} dot={{ fill: '#ff6b35', r: 5 }} />
                  <Line type="monotone" dataKey="INC" stroke={theme.secondary} strokeWidth={3} dot={{ fill: theme.secondary, r: 5 }} />
                  <Line type="monotone" dataKey="AAP" stroke={theme.success} strokeWidth={3} dot={{ fill: theme.success, r: 5 }} />
                  <Line type="monotone" dataKey="TMC" stroke={theme.primary} strokeWidth={3} dot={{ fill: theme.primary, r: 5 }} />
                  <Line type="monotone" dataKey="Others" stroke={theme.warning} strokeWidth={3} dot={{ fill: theme.warning, r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid.Col>

          {/* App Usage Trends */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <ChartCard
              title="App Usage Trends"
              subtitle="Monthly growth in engagement metrics and feature adoption"
              icon="📱"
              delay={0.7}
            >
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={appUsageTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gray[200]} />
                  <XAxis dataKey="month" stroke={theme.gray[600]} />
                  <YAxis stroke={theme.gray[600]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="dailyActiveUsers" stroke={theme.secondary} strokeWidth={3} name="Daily Active Users" dot={{ fill: theme.secondary, r: 5 }} />
                  <Line type="monotone" dataKey="sessionDuration" stroke={theme.success} strokeWidth={3} name="Session Duration (min)" dot={{ fill: theme.success, r: 5 }} />
                  <Line type="monotone" dataKey="featuresUsed" stroke={theme.warning} strokeWidth={3} name="Features Used" dot={{ fill: theme.warning, r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid.Col>
        </Grid>

        {/* Additional Analytics Section */}
        <Grid>
          {/* AI OKR Categories */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <ChartCard
              title="AI-Generated OKR Categories"
              subtitle="Focus areas identified by AI analysis"
              icon="🎯"
              delay={0.8}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { category: 'Infrastructure Development', count: 145, color: '#3b82f6' },
                  { category: 'Public Healthcare', count: 89, color: '#10b981' },
                  { category: 'Education Improvement', count: 76, color: '#f59e0b' },
                  { category: 'Employment Generation', count: 65, color: '#ef4444' },
                  { category: 'Digital Governance', count: 54, color: '#8b5cf6' },
                ]} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gray[200]} />
                  <XAxis type="number" stroke={theme.gray[600]} />
                  <YAxis dataKey="category" type="category" width={120} stroke={theme.gray[600]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" fill={theme.secondary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid.Col>

          {/* Mobile App Activity by Time */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <ChartCard
              title="Daily App Activity"
              subtitle="Representatives active throughout the day"
              icon="⏰"
              delay={0.9}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { time: '6 AM', activeReps: 12 },
                  { time: '9 AM', activeReps: 45 },
                  { time: '12 PM', activeReps: 78 },
                  { time: '3 PM', activeReps: 92 },
                  { time: '6 PM', activeReps: 67 },
                  { time: '9 PM', activeReps: 34 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.gray[200]} />
                  <XAxis dataKey="time" stroke={theme.gray[600]} />
                  <YAxis stroke={theme.gray[600]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="activeReps" stroke={theme.danger} strokeWidth={3} name="Active Representatives" dot={{ fill: theme.danger, r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid.Col>
        </Grid>


        {/* App Downtime Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card 
            shadow="xs" 
            padding="lg" 
            radius="lg"
            style={{ 
              background: 'white',
              border: '1px solid #f1f3f4'
            }}
          >
            <Group mb="lg">
              <Text size="md" fw={500} style={{ color: theme.gray[800] }}>
                App Status & Alerts
              </Text>
            </Group>
            <Text size="xs" style={{ color: theme.gray[500] }} mb="lg">
              System health monitoring and downtime notifications
            </Text>
            <Stack gap="sm">
              {[
                { 
                  service: 'Mobile App API', 
                  status: 'operational', 
                  uptime: '99.8%', 
                  lastCheck: '2 min ago',
                  responseTime: '145ms'
                },
                { 
                  service: 'Authentication Service', 
                  status: 'operational', 
                  uptime: '99.9%', 
                  lastCheck: '1 min ago',
                  responseTime: '89ms'
                },
                { 
                  service: 'Database Connection', 
                  status: 'operational', 
                  uptime: '99.7%', 
                  lastCheck: '30 sec ago',
                  responseTime: '23ms'
                },
                { 
                  service: 'Push Notifications', 
                  status: 'degraded', 
                  uptime: '98.2%', 
                  lastCheck: '5 min ago',
                  responseTime: '320ms'
                },
                { 
                  service: 'File Upload Service', 
                  status: 'operational', 
                  uptime: '99.5%', 
                  lastCheck: '3 min ago',
                  responseTime: '167ms'
                },
              ].map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.05 }}
                >
                  <Paper 
                    p="sm" 
                    radius="md" 
                    style={{ 
                      backgroundColor: alert.status === 'operational' ? '#f0fdf4' : alert.status === 'degraded' ? '#fffbeb' : '#fef2f2',
                      border: `1px solid ${alert.status === 'operational' ? '#bbf7d0' : alert.status === 'degraded' ? '#fed7aa' : '#fecaca'}`
                    }}
                  >
                    <Group justify="space-between" align="center">
                      <Group>
                        <Box
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: alert.status === 'operational' ? theme.success : alert.status === 'degraded' ? theme.warning : theme.danger
                          }}
                        />
                        <Box>
                          <Text size="sm" fw={500} style={{ color: theme.gray[800] }}>
                            {alert.service}
                          </Text>
                          <Text size="xs" style={{ color: theme.gray[600] }}>
                            Uptime: {alert.uptime} • Response: {alert.responseTime}
                          </Text>
                        </Box>
                      </Group>
                      <Group>
                        <Badge 
                          color={alert.status === 'operational' ? 'green' : alert.status === 'degraded' ? 'yellow' : 'red'} 
                          variant="light" 
                          size="xs"
                        >
                          {alert.status}
                        </Badge>
                        <Text size="xs" style={{ color: theme.gray[500] }}>
                          {alert.lastCheck}
                        </Text>
                      </Group>
                    </Group>
                  </Paper>
                </motion.div>
              ))}
            </Stack>
            
            {/* System Health Summary */}
            <Paper p="md" radius="lg" mt="md" style={{ backgroundColor: theme.gray[50], border: '1px solid #e5e7eb' }}>
              <Group justify="space-between" align="center">
                <Box>
                  <Text size="sm" fw={500} style={{ color: theme.gray[800] }}>
                    Overall System Health
                  </Text>
                  <Text size="xs" style={{ color: theme.gray[600] }}>
                    All critical services monitored
                  </Text>
                </Box>
                <Group>
                  <Badge color="green" variant="filled" size="sm">
                    99.4% Uptime
                  </Badge>
                  <Text size="lg" fw={600} style={{ color: theme.success }}>
                    ●
                  </Text>
                </Group>
              </Group>
            </Paper>
          </Card>
        </motion.div>
      </Stack>
    </Box>
  )
}

export default ExecutiveDashboard