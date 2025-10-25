'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, Space, Typography, message } from 'antd';
import { SaveOutlined, ShareAltOutlined, HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

interface DocumentHeaderProps {
  documentId: string;
  title: string;
  onTitleChange: (title: string) => void;
  onSave: () => Promise<void>;
  onShare: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isViewOnly?: boolean;
}

export default function DocumentHeader({
  documentId,
  title,
  onTitleChange,
  onSave,
  onShare,
  isSaving,
  hasUnsavedChanges,
  isViewOnly = false,
}: DocumentHeaderProps) {
  const router = useRouter();
  const [editingTitle, setEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  const handleTitleBlur = () => {
    setEditingTitle(false);
    if (localTitle !== title && localTitle.trim()) {
      onTitleChange(localTitle);
    } else {
      setLocalTitle(title);
    }
  };

  const handleSave = async () => {
    try {
      await onSave();
      message.success('Document saved successfully');
    } catch (error) {
      message.error('Failed to save document');
    }
  };

  return (
    <div
      style={{
        padding: '12px 24px',
        borderBottom: '1px solid #f0f0f0',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Button
          icon={<HomeOutlined />}
          onClick={() => router.push('/')}
          style={{ marginRight: 16 }}
        >
          Home
        </Button>

        {editingTitle && !isViewOnly ? (
          <Input
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onPressEnter={handleTitleBlur}
            autoFocus
            style={{ maxWidth: 400 }}
          />
        ) : (
          <Typography.Title
            level={4}
            style={{
              margin: 0,
              cursor: isViewOnly ? 'default' : 'pointer',
            }}
            onClick={() => !isViewOnly && setEditingTitle(true)}
          >
            {title}
          </Typography.Title>
        )}

        {isViewOnly && (
          <Text type="secondary" style={{ marginLeft: 12 }}>
            (Read-only)
          </Text>
        )}
      </div>

      <Space>
        {hasUnsavedChanges && !isViewOnly && (
          <Text type="warning" style={{ fontSize: 12 }}>
            Unsaved changes
          </Text>
        )}

        {!isViewOnly && (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={isSaving}
          >
            Save
          </Button>
        )}

        <Button icon={<ShareAltOutlined />} onClick={onShare}>
          Share
        </Button>
      </Space>
    </div>
  );
}
