'use client';

import { useRouter } from 'next/navigation';
import { Button, Typography, Space, Card } from 'antd';
import { FileTextOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleCreateDocument = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Untitled Document',
          content: '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      const data = await response.json();
      router.push(`/edit/${data.id}?key=${data.edit_key}`);
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <FileTextOutlined
              style={{ fontSize: 64, color: '#1890ff', marginBottom: 16 }}
            />
            <Title level={1} style={{ marginBottom: 8 }}>
              MDLink
            </Title>
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
            onClick={handleCreateDocument}
            loading={creating}
            style={{ height: 50, fontSize: 16 }}
          >
            Create New Document
          </Button>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Paragraph type="secondary" style={{ fontSize: 14 }}>
              <strong>Features:</strong>
              <br />
              Split view editor • Real-time preview • Share via links
              <br />
              Auto-save • No account required
            </Paragraph>
          </div>
        </Space>
      </Card>
    </div>
  );
}
