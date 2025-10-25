'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Layout, Spin, message, Badge } from 'antd';
import MarkdownPreview from '@/components/MarkdownPreview';
import DocumentHeader from '@/components/DocumentHeader';
import ShareModal from '@/components/ShareModal';

const { Content } = Layout;

export default function ViewDocumentPage() {
  const params = useParams();
  const documentSlug = params.slug as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentSlug}`);

        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }

        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
        setLoading(false);
      } catch (error) {
        message.error('Failed to load document');
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentSlug]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Layout style={{ height: '100vh' }}>
        <DocumentHeader
          documentSlug={documentSlug}
          title={title}
          onTitleChange={() => {}}
          onSave={async () => {}}
          onShare={() => setShareModalVisible(true)}
          isSaving={false}
          hasUnsavedChanges={false}
          isViewOnly={true}
        />

        <Content style={{ overflow: 'auto', background: '#fff' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
            <Badge.Ribbon text="Read-only" color="gray">
              <div
                style={{
                  background: '#fff',
                  padding: '24px',
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                }}
              >
                <MarkdownPreview content={content} />
              </div>
            </Badge.Ribbon>
          </div>
        </Content>
      </Layout>

      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        documentSlug={documentSlug}
      />
    </>
  );
}

