'use client';

import React from 'react';
import { Modal, Input, Button, Space, Typography, message } from 'antd';
import { CopyOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  documentId: string;
  editKey?: string;
}

export default function ShareModal({
  visible,
  onClose,
  documentId,
  editKey,
}: ShareModalProps) {
  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : '';

  const viewLink = `${baseUrl}/view/${documentId}`;
  const editLink = editKey
    ? `${baseUrl}/edit/${documentId}?key=${editKey}`
    : '';

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(`${label} copied to clipboard`);
    } catch (error) {
      message.error('Failed to copy to clipboard');
    }
  };

  return (
    <Modal
      title="Share Document"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* View Link */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <EyeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Text strong>View-only Link</Text>
          </div>
          <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>
            Anyone with this link can view the document (read-only)
          </Paragraph>
          <Input.Group compact style={{ display: 'flex' }}>
            <Input
              value={viewLink}
              readOnly
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(viewLink, 'View link')}
            >
              Copy
            </Button>
          </Input.Group>
        </div>

        {/* Edit Link */}
        {editLink && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <EditOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              <Text strong>Edit Link</Text>
            </div>
            <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>
              Anyone with this link can edit the document. Keep it private!
            </Paragraph>
            <Input.Group compact style={{ display: 'flex' }}>
              <Input
                value={editLink}
                readOnly
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(editLink, 'Edit link')}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Copy
              </Button>
            </Input.Group>
          </div>
        )}

        <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <strong>Note:</strong> The edit link contains a secret key that
            allows editing. Only share it with people you trust.
          </Text>
        </div>
      </Space>
    </Modal>
  );
}
