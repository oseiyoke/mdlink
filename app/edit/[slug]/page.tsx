'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Layout, Spin, message } from 'antd';
import MarkdownEditor from '@/components/MarkdownEditor';
import MarkdownPreview from '@/components/MarkdownPreview';
import DocumentHeader from '@/components/DocumentHeader';
import ShareModal from '@/components/ShareModal';

const { Content, Sider } = Layout;

export default function EditDocumentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const documentSlug = params.slug as string;
  const editKey = searchParams.get('key');

  const [title, setTitle] = useState('Untitled Document');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isValidEditKey, setIsValidEditKey] = useState(false);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef('');
  const lastSavedTitleRef = useRef('Untitled Document');

  // Validate edit key
  useEffect(() => {
    const validateEditKey = async () => {
      if (!editKey) {
        message.warning('No edit key provided. Redirecting to view mode...');
        setTimeout(() => router.push(`/view/${documentSlug}`), 2000);
        return;
      }

      try {
        const response = await fetch(`/api/documents/${documentSlug}/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ edit_key: editKey }),
        });

        const data = await response.json();

        if (data.valid) {
          setIsValidEditKey(true);
        } else {
          message.error('Invalid edit key. Redirecting to view mode...');
          setTimeout(() => router.push(`/view/${documentSlug}`), 2000);
        }
      } catch (error) {
        message.error('Failed to validate edit key');
        setTimeout(() => router.push(`/view/${documentSlug}`), 2000);
      }
    };

    validateEditKey();
  }, [documentSlug, editKey, router]);

  // Fetch document
  useEffect(() => {
    if (!isValidEditKey) return;

    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentSlug}`);

        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }

        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
        lastSavedContentRef.current = data.content;
        lastSavedTitleRef.current = data.title;
        setLoading(false);
      } catch (error) {
        message.error('Failed to load document');
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentSlug, isValidEditKey]);

  const handleSave = useCallback(async () => {
    if (!editKey) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/documents/${documentSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          edit_key: editKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      lastSavedContentRef.current = content;
      lastSavedTitleRef.current = title;
      setHasUnsavedChanges(false);
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [editKey, documentSlug, title, content]);

  // Auto-save functionality
  useEffect(() => {
    if (!isValidEditKey) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    if (hasUnsavedChanges) {
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave();
      }, 30000); // Auto-save after 30 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, title, hasUnsavedChanges, isValidEditKey, handleSave]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  }, []);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    setHasUnsavedChanges(true);
  }, []);

  if (loading || !isValidEditKey) {
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
          onTitleChange={handleTitleChange}
          onSave={handleSave}
          onShare={() => setShareModalVisible(true)}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        <Layout style={{ height: 'calc(100vh - 65px)' }}>
          <Content style={{ height: '100%', overflow: 'auto' }}>
            <MarkdownEditor value={content} onChange={handleContentChange} />
          </Content>

          <Sider
            width="50%"
            style={{
              background: '#fff',
              borderLeft: '1px solid #f0f0f0',
              overflow: 'auto',
            }}
          >
            <MarkdownPreview content={content} />
          </Sider>
        </Layout>
      </Layout>

      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        documentSlug={documentSlug}
        editKey={editKey || undefined}
      />
    </>
  );
}

