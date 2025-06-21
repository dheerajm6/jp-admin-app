import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';

const theme = createTheme({
  primaryColor: 'violet',
  colors: {
    violet: [
      '#f5f3ff',
      '#ede9fe', 
      '#ddd6fe',
      '#c4b5fd',
      '#a78bfa',
      '#8b5cf6',
      '#7c3aed',
      '#6d28d9',
      '#5b21b6',
      '#4c1d95'
    ]
  },
  fontFamily: 'Inter, sans-serif',
  radius: {
    xs: '0.375rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem'
  },
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <AuthProvider>
        <ProtectedRoute>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/data-uploads" element={<div>Data Uploads Page - Coming Soon</div>} />
                <Route path="/user-requests" element={<div>User Requests Page - Coming Soon</div>} />
                <Route path="/profile" element={<div>Profile Page - Coming Soon</div>} />
              </Routes>
            </Layout>
          </Router>
        </ProtectedRoute>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
