import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import './Dashboard.css'

type AlertLevel = 'good' | 'warning' | 'critical'

interface TabInfo {
  id: string
  name: string
  icon: string
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
    { id: 'overview', name: 'Overview', icon: '📊', alertLevel: 'warning', alertCount: 3 },
    { id: 'performance', name: 'Performance & Analytics', icon: '⚡', alertLevel: 'critical', alertCount: 2 },
    { id: 'security', name: 'Security & Compliance', icon: '🔒', alertLevel: 'good', alertCount: 0 },
    { id: 'political', name: 'Political Intelligence', icon: '🏛️', alertLevel: 'warning', alertCount: 1 },
    { id: 'operations', name: 'Operations', icon: '⚙️', alertLevel: 'good', alertCount: 0 },
    { id: 'experience', name: 'User Experience', icon: '👥', alertLevel: 'warning', alertCount: 4 }
  ]

  const mockKPIs: KPI[] = [
    { title: 'Active Users', value: '24,847', change: '+12%', trend: 'up', level: 'good' },
    { title: 'API Response Time', value: '1.2s', change: '+0.3s', trend: 'down', level: 'critical' },
    { title: 'System Uptime', value: '99.8%', change: '-0.1%', trend: 'down', level: 'warning' },
    { title: 'Data Accuracy', value: '97.5%', change: '+1.2%', trend: 'up', level: 'good' }
  ]

  const getAlertColor = (level: AlertLevel) => {
    switch (level) {
      case 'critical': return 'bg-red-500'
      case 'warning': return 'bg-yellow-500'
      case 'good': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getAlertTextColor = (level: AlertLevel) => {
    switch (level) {
      case 'critical': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      case 'good': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      case 'stable': return '➡️'
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const renderOverviewTab = () => (
    <div className="tab-content">
      <div className="kpi-grid">
        {mockKPIs.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`kpi-card ${kpi.level}`}
          >
            <div className="kpi-header">
              <span className="kpi-title">{kpi.title}</span>
              <span className={`kpi-trend ${getAlertTextColor(kpi.level)}`}>
                {getTrendIcon(kpi.trend)} {kpi.change}
              </span>
            </div>
            <div className="kpi-value">{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="critical-alerts">
        <h3>Critical Alerts</h3>
        <div className="alert-list">
          <div className="alert-item critical">
            <span className="alert-dot bg-red-500"></span>
            <span>API response time exceeded 1s threshold</span>
            <button className="alert-action">Investigate</button>
          </div>
          <div className="alert-item warning">
            <span className="alert-dot bg-yellow-500"></span>
            <span>System uptime below 99.9%</span>
            <button className="alert-action">View Details</button>
          </div>
          <div className="alert-item warning">
            <span className="alert-dot bg-yellow-500"></span>
            <span>4 new user experience issues reported</span>
            <button className="alert-action">Review</button>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <button onClick={() => navigate('/representatives')} className="action-card">
            <span className="action-icon">👥</span>
            <span>Manage Representatives</span>
          </button>
          <button onClick={() => navigate('/analytics')} className="action-card">
            <span className="action-icon">📈</span>
            <span>View Analytics</span>
          </button>
          <button onClick={() => setActiveTab('security')} className="action-card">
            <span className="action-icon">🔒</span>
            <span>Security Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('operations')} className="action-card">
            <span className="action-icon">⚙️</span>
            <span>System Status</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab()
      case 'performance':
        return (
          <div className="tab-content">
            <h3>Performance & Analytics</h3>
            <div className="metric-cards">
              <div className="metric-card">
                <h4>API Performance</h4>
                <div className="metric-value critical">1.2s avg response</div>
                <p>⚠️ Exceeding 1s threshold</p>
              </div>
              <div className="metric-card">
                <h4>User Analytics</h4>
                <div className="metric-value good">24,847 active users</div>
                <p>✅ 12% increase from last week</p>
              </div>
            </div>
          </div>
        )
      case 'security':
        return (
          <div className="tab-content">
            <h3>Security & Compliance</h3>
            <div className="security-status good">
              <div className="status-indicator">
                <span className="status-dot bg-green-500"></span>
                <span>All systems secure</span>
              </div>
              <p>No security incidents in the last 24 hours</p>
            </div>
          </div>
        )
      case 'political':
        return (
          <div className="tab-content">
            <h3>Political Intelligence</h3>
            <div className="political-metrics">
              <div className="metric-card">
                <h4>Constituency Coverage</h4>
                <div className="metric-value warning">89%</div>
                <p>⚠️ 47 constituencies need attention</p>
              </div>
            </div>
          </div>
        )
      case 'operations':
        return (
          <div className="tab-content">
            <h3>Operations</h3>
            <div className="ops-status good">
              <div className="status-indicator">
                <span className="status-dot bg-green-500"></span>
                <span>All systems operational</span>
              </div>
              <p>Uptime: 99.8% | Last backup: 2 hours ago</p>
            </div>
          </div>
        )
      case 'experience':
        return (
          <div className="tab-content">
            <h3>User Experience</h3>
            <div className="ux-metrics">
              <div className="metric-card">
                <h4>App Rating</h4>
                <div className="metric-value warning">4.2/5</div>
                <p>⚠️ Down from 4.5 last month</p>
              </div>
              <div className="metric-card">
                <h4>Support Tickets</h4>
                <div className="metric-value warning">23 open</div>
                <p>⚠️ 4 high priority tickets</p>
              </div>
            </div>
          </div>
        )
      default:
        return renderOverviewTab()
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>JanPulse Mission Control</h1>
          <p>Welcome back, {user?.email?.split('@')[0]} | Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
            {tab.alertCount > 0 && (
              <span className={`alert-badge ${getAlertColor(tab.alertLevel)}`}>
                {tab.alertCount}
              </span>
            )}
            <span className={`alert-indicator ${getAlertColor(tab.alertLevel)}`}></span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="tab-container"
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

      <div className="floating-action">
        <button className="fab" title="Quick Actions">
          ⚡
        </button>
      </div>
    </div>
  )
}

export default Dashboard