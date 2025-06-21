import React from 'react'
import { Modal, Typography } from 'antd'

const { Title } = Typography

interface RequestDetailsModalProps {
  request: any;
  onClose: () => void;
  onAction: (action: string) => void;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ request, onClose, onAction }) => {
  return (
    <Modal
      title="Request Details"
      open={!!request}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Title level={4}>Request details will be shown here</Title>
      <p>Modal functionality coming soon...</p>
    </Modal>
  )
}

export default RequestDetailsModal