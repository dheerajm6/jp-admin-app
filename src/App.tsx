import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Representatives from './pages/Representatives';
import DataUploads from './pages/DataUploads';
import SignupRequests from './pages/SignupRequests';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Integrations from './pages/Integrations';
import './App.css';

const antdTheme = {
  token: {
    colorPrimary: '#8b5cf6',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
    },
    Input: {
      borderRadius: 8,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AuthProvider>
        <ProtectedRoute>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/data-uploads" element={<DataUploads />} />
                <Route path="/representatives" element={<Representatives />} />
                <Route path="/signup-requests" element={<SignupRequests />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/profile" element={<div>Profile Page - Coming Soon</div>} />
              </Routes>
            </Layout>
          </Router>
        </ProtectedRoute>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
