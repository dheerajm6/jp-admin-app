import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Badge,
  Progress,
  Button,
  Space,
  Statistic,
  Table,
  Tag,
  Alert,
  Divider,
  Tooltip,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch
} from 'antd';
import {
  CloudOutlined,
  ApiOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
  DollarOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'warning' | 'error';
  subscriptionDate: string;
  renewalDate: string;
  monthlyLimit: number;
  currentUsage: number;
  monthlyCost: number;
  category: string;
  icon: string;
  features: string[];
  apiEndpoint?: string;
  lastUpdated: string;
}

const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Twilio',
      description: 'SMS and Voice communication services',
      status: 'active',
      subscriptionDate: '2024-01-15',
      renewalDate: '2025-01-15',
      monthlyLimit: 10000,
      currentUsage: 7250,
      monthlyCost: 299,
      category: 'Communication',
      icon: '📱',
      features: ['SMS API', 'Voice Calls', 'WhatsApp Business'],
      apiEndpoint: 'https://api.twilio.com',
      lastUpdated: '2024-12-09'
    },
    {
      id: '2',
      name: 'PushNami',
      description: 'Push notification and messaging platform',
      status: 'active',
      subscriptionDate: '2024-02-01',
      renewalDate: '2025-02-01',
      monthlyLimit: 50000,
      currentUsage: 32800,
      monthlyCost: 199,
      category: 'Notifications',
      icon: '🔔',
      features: ['Push Notifications', 'In-App Messaging', 'Analytics'],
      apiEndpoint: 'https://api.pushnami.com',
      lastUpdated: '2024-12-09'
    },
    {
      id: '3',
      name: 'AWS Cloud Services',
      description: 'Cloud computing and storage services',
      status: 'active',
      subscriptionDate: '2023-12-01',
      renewalDate: '2024-12-01',
      monthlyLimit: 1000,
      currentUsage: 850,
      monthlyCost: 450,
      category: 'Cloud Infrastructure',
      icon: '☁️',
      features: ['EC2', 'S3 Storage', 'RDS', 'Lambda'],
      apiEndpoint: 'https://aws.amazon.com',
      lastUpdated: '2024-12-09'
    },
    {
      id: '4',
      name: 'Google Maps API',
      description: 'Mapping and geolocation services',
      status: 'warning',
      subscriptionDate: '2024-03-01',
      renewalDate: '2025-03-01',
      monthlyLimit: 25000,
      currentUsage: 24100,
      monthlyCost: 150,
      category: 'Location Services',
      icon: '🗺️',
      features: ['Geocoding', 'Places API', 'Directions'],
      apiEndpoint: 'https://maps.googleapis.com',
      lastUpdated: '2024-12-09'
    },
    {
      id: '5',
      name: 'SendGrid',
      description: 'Email delivery and marketing platform',
      status: 'active',
      subscriptionDate: '2024-01-10',
      renewalDate: '2025-01-10',
      monthlyLimit: 100000,
      currentUsage: 45600,
      monthlyCost: 89,
      category: 'Email Services',
      icon: '📧',
      features: ['Transactional Email', 'Marketing Campaigns', 'Analytics'],
      apiEndpoint: 'https://api.sendgrid.com',
      lastUpdated: '2024-12-09'
    },
    {
      id: '6',
      name: 'Stripe',
      description: 'Payment processing and billing',
      status: 'active',
      subscriptionDate: '2023-11-15',
      renewalDate: '2024-11-15',
      monthlyLimit: 5000,
      currentUsage: 1250,
      monthlyCost: 0, // Usage-based pricing
      category: 'Payments',
      icon: '💳',
      features: ['Payment Processing', 'Subscriptions', 'Invoicing'],
      apiEndpoint: 'https://api.stripe.com',
      lastUpdated: '2024-12-09'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [form] = Form.useForm();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getUsageProgress = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    let status: 'success' | 'normal' | 'exception' = 'normal';
    
    if (percentage >= 90) status = 'exception';
    else if (percentage >= 75) status = 'normal';
    else status = 'success';
    
    return { percentage, status };
  };

  const getDaysUntilRenewal = (renewalDate: string) => {
    return dayjs(renewalDate).diff(dayjs(), 'day');
  };

  const getTotalMonthlyCost = () => {
    return integrations.reduce((total, integration) => total + integration.monthlyCost, 0);
  };

  const getActiveIntegrationsCount = () => {
    return integrations.filter(integration => integration.status === 'active').length;
  };

  const showAddEditModal = (integration?: Integration) => {
    setEditingIntegration(integration || null);
    if (integration) {
      form.setFieldsValue({
        ...integration,
        subscriptionDate: dayjs(integration.subscriptionDate),
        renewalDate: dayjs(integration.renewalDate),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        subscriptionDate: values.subscriptionDate.format('YYYY-MM-DD'),
        renewalDate: values.renewalDate.format('YYYY-MM-DD'),
        lastUpdated: dayjs().format('YYYY-MM-DD'),
        id: editingIntegration?.id || Date.now().toString(),
        features: values.features || []
      };

      if (editingIntegration) {
        setIntegrations(prev => 
          prev.map(integration => 
            integration.id === editingIntegration.id ? formattedValues : integration
          )
        );
      } else {
        setIntegrations(prev => [...prev, formattedValues]);
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingIntegration(null);
    });
  };

  const columns = [
    {
      title: 'Service',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Integration) => (
        <Space>
          <span style={{ fontSize: '20px' }}>{record.icon}</span>
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.category}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={getStatusColor(status) as any} 
          text={status.toUpperCase()} 
        />
      ),
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (record: Integration) => {
        const { percentage, status } = getUsageProgress(record.currentUsage, record.monthlyLimit);
        return (
          <div style={{ width: '120px' }}>
            <Progress 
              percent={Math.round(percentage)} 
              size="small" 
              status={status}
              showInfo={false}
            />
            <Text style={{ fontSize: '11px', color: '#666' }}>
              {record.currentUsage.toLocaleString()} / {record.monthlyLimit.toLocaleString()}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Monthly Cost',
      dataIndex: 'monthlyCost',
      key: 'monthlyCost',
      render: (cost: number) => (
        <Text strong style={{ color: cost > 0 ? '#1890ff' : '#52c41a' }}>
          {cost > 0 ? `$${cost}` : 'Usage-based'}
        </Text>
      ),
    },
    {
      title: 'Renewal',
      dataIndex: 'renewalDate',
      key: 'renewalDate',
      render: (date: string) => {
        const days = getDaysUntilRenewal(date);
        return (
          <div>
            <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>
            <br />
            <Text 
              style={{ 
                fontSize: '11px', 
                color: days <= 30 ? '#ff4d4f' : '#666' 
              }}
            >
              {days > 0 ? `${days} days left` : 'Expired'}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Integration) => (
        <Space>
          <Tooltip title="Edit Integration">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => showAddEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Refresh Usage">
            <Button 
              type="text" 
              icon={<ReloadOutlined />} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Service Integrations</Title>
        <Text type="secondary">
          Manage and monitor third-party service integrations, usage, and renewals
        </Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Services"
              value={getActiveIntegrationsCount()}
              suffix={`/ ${integrations.length}`}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Monthly Cost"
              value={getTotalMonthlyCost()}
              prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
              precision={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Expiring Soon"
              value={integrations.filter(i => getDaysUntilRenewal(i.renewalDate) <= 30).length}
              prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="High Usage"
              value={integrations.filter(i => {
                const { percentage } = getUsageProgress(i.currentUsage, i.monthlyLimit);
                return percentage >= 80;
              }).length}
              prefix={<BarChartOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Usage Alerts */}
      {integrations.some(i => {
        const { percentage } = getUsageProgress(i.currentUsage, i.monthlyLimit);
        return percentage >= 90;
      }) && (
        <Alert
          message="High Usage Warning"
          description={
            <div>
              The following services are approaching their monthly limits:
              <ul style={{ marginTop: '8px', marginBottom: '0' }}>
                {integrations
                  .filter(i => {
                    const { percentage } = getUsageProgress(i.currentUsage, i.monthlyLimit);
                    return percentage >= 90;
                  })
                  .map(integration => (
                    <li key={integration.id}>
                      <strong>{integration.name}</strong> - {Math.round((integration.currentUsage / integration.monthlyLimit) * 100)}% used
                    </li>
                  ))}
              </ul>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Integration Cards Grid */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {integrations.map(integration => {
          const { percentage, status } = getUsageProgress(integration.currentUsage, integration.monthlyLimit);
          const daysUntilRenewal = getDaysUntilRenewal(integration.renewalDate);
          
          return (
            <Col xs={24} sm={12} lg={8} key={integration.id}>
              <Card
                title={
                  <Space>
                    <span style={{ fontSize: '24px' }}>{integration.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{integration.name}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {integration.category}
                      </Text>
                    </div>
                  </Space>
                }
                extra={<Badge status={getStatusColor(integration.status) as any} />}
                actions={[
                  <Tooltip title="Edit" key="edit">
                    <EditOutlined onClick={() => showAddEditModal(integration)} />
                  </Tooltip>,
                  <Tooltip title="Settings" key="settings">
                    <SettingOutlined />
                  </Tooltip>,
                  <Tooltip title="Refresh" key="refresh">
                    <ReloadOutlined />
                  </Tooltip>,
                ]}
                style={{ height: '100%' }}
              >
                <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '16px' }}>
                  {integration.description}
                </Text>
                
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ fontSize: '12px', color: '#666' }}>USAGE THIS MONTH</Text>
                  <Progress 
                    percent={Math.round(percentage)} 
                    status={status}
                    style={{ marginBottom: '4px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: '11px' }}>
                      {integration.currentUsage.toLocaleString()} used
                    </Text>
                    <Text style={{ fontSize: '11px' }}>
                      {integration.monthlyLimit.toLocaleString()} limit
                    </Text>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>MONTHLY COST</Text>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#1890ff' }}>
                        {integration.monthlyCost > 0 ? `$${integration.monthlyCost}` : 'Usage-based'}
                      </div>
                    </Col>
                    <Col span={12}>
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>RENEWAL</Text>
                      <div style={{ 
                        fontSize: '12px', 
                        color: daysUntilRenewal <= 30 ? '#ff4d4f' : '#666',
                        fontWeight: daysUntilRenewal <= 30 ? 600 : 400
                      }}>
                        {daysUntilRenewal > 0 ? `${daysUntilRenewal} days` : 'Expired'}
                      </div>
                    </Col>
                  </Row>
                </div>

                <div>
                  <Text strong style={{ fontSize: '12px', color: '#666' }}>FEATURES</Text>
                  <div style={{ marginTop: '4px' }}>
                    {integration.features.slice(0, 3).map(feature => (
                      <Tag key={feature} style={{ marginBottom: '4px', fontSize: '12px' }}>
                        {feature}
                      </Tag>
                    ))}
                    {integration.features.length > 3 && (
                      <Tag style={{ fontSize: '12px' }}>+{integration.features.length - 3} more</Tag>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Detailed Table */}
      <Card 
        title="Detailed Overview" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => showAddEditModal()}
          >
            Add Integration
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={integrations}
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingIntegration ? 'Edit Integration' : 'Add New Integration'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingIntegration(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Service Name"
                rules={[{ required: true, message: 'Please enter service name' }]}
              >
                <Input placeholder="e.g., Twilio, AWS" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="Communication">Communication</Option>
                  <Option value="Cloud Infrastructure">Cloud Infrastructure</Option>
                  <Option value="Notifications">Notifications</Option>
                  <Option value="Location Services">Location Services</Option>
                  <Option value="Email Services">Email Services</Option>
                  <Option value="Payments">Payments</Option>
                  <Option value="Analytics">Analytics</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Brief description of the service" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="icon"
                label="Icon"
              >
                <Input placeholder="📱" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="monthlyCost"
                label="Monthly Cost ($)"
                rules={[{ required: true, message: 'Please enter monthly cost' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="warning">Warning</Option>
                  <Option value="error">Error</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="subscriptionDate"
                label="Subscription Date"
                rules={[{ required: true, message: 'Please select subscription date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="renewalDate"
                label="Renewal Date"
                rules={[{ required: true, message: 'Please select renewal date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="monthlyLimit"
                label="Monthly Limit"
                rules={[{ required: true, message: 'Please enter monthly limit' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currentUsage"
                label="Current Usage"
                rules={[{ required: true, message: 'Please enter current usage' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="apiEndpoint"
            label="API Endpoint"
          >
            <Input placeholder="https://api.service.com" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Integrations;