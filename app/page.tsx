'use client';

import { useRouter } from 'next/navigation';
import { Button, Typography, Space, Card, Modal, Input } from 'antd';
import { FileTextOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');

  const showModal = () => {
    setDocumentTitle('');
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDocumentTitle('');
  };

  const handleCreateDocument = async () => {
    setCreating(true);
    setIsModalOpen(false);
    
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: documentTitle.trim() || 'Untitled Document',
          content: '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      const data = await response.json();
      router.push(`/edit/${data.slug}?key=${data.edit_key}`);
    } catch (error) {
      console.error('Error creating document:', error);
      setCreating(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        padding: '24px',
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Paragraph type="secondary" style={{ fontSize: 16 }}>
              A lightweight markdown editor for creating, editing, and sharing
              documents with real-time preview.
            </Paragraph>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<EditOutlined />}
            block
            onClick={showModal}
            loading={creating}
            style={{ height: 50, fontSize: 16 }}
          >
            Create New Document
          </Button>

         
        </Space>
      </Card>

      <Modal
        title="Create New Document"
        open={isModalOpen}
        onOk={handleCreateDocument}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{ disabled: creating }}
      >
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Document Name
          </label>
          <Input
            placeholder="Enter document name (optional)"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            onPressEnter={handleCreateDocument}
            maxLength={100}
            autoFocus
          />
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
            Leave blank to use &quot;Untitled Document&quot;
          </div>
        </div>
      </Modal>
    </div>
  );
}
