'use client';

import React, { useRef, useState, useEffect } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Button, Space, Tooltip, Divider } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function MarkdownEditor({
  value,
  onChange,
  readOnly = false,
}: MarkdownEditorProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  // Capture textarea ref when editor mounts or updates
  useEffect(() => {
    if (editorRef.current) {
      const textarea = editorRef.current.querySelector('textarea');
      if (textarea) {
        textAreaRef.current = textarea;
      }
    }
  }, []);

  const insertMarkdown = (
    before: string,
    after: string = '',
    placeholder: string = ''
  ) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newValue =
      value.substring(0, start) +
      before +
      textToInsert +
      after +
      value.substring(end);

    onChange(newValue);

    // Set cursor position after insert
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos + after.length);
    }, 0);
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setSelectionStart(e.target.selectionStart);
    setSelectionEnd(e.target.selectionEnd);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {!readOnly && (
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid #e8e8e8',
            backgroundColor: '#fafafa',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          <Space size={4}>
            <Tooltip title="Bold (Ctrl+B)">
              <Button
                size="small"
                icon={<BoldOutlined />}
                onClick={() => insertMarkdown('**', '**', 'bold text')}
              />
            </Tooltip>
            <Tooltip title="Italic (Ctrl+I)">
              <Button
                size="small"
                icon={<ItalicOutlined />}
                onClick={() => insertMarkdown('*', '*', 'italic text')}
              />
            </Tooltip>
            <Tooltip title="Strikethrough">
              <Button
                size="small"
                icon={<StrikethroughOutlined />}
                onClick={() => insertMarkdown('~~', '~~', 'strikethrough')}
              />
            </Tooltip>
          </Space>

          <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />

          <Space size={4}>
            <Tooltip title="Heading 1">
              <Button
                size="small"
                onClick={() => insertMarkdown('# ', '', 'Heading 1')}
              >
                H1
              </Button>
            </Tooltip>
            <Tooltip title="Heading 2">
              <Button
                size="small"
                onClick={() => insertMarkdown('## ', '', 'Heading 2')}
              >
                H2
              </Button>
            </Tooltip>
            <Tooltip title="Heading 3">
              <Button
                size="small"
                onClick={() => insertMarkdown('### ', '', 'Heading 3')}
              >
                H3
              </Button>
            </Tooltip>
          </Space>

          <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />

          <Space size={4}>
            <Tooltip title="Bullet List">
              <Button
                size="small"
                icon={<UnorderedListOutlined />}
                onClick={() => insertMarkdown('- ', '', 'List item')}
              />
            </Tooltip>
            <Tooltip title="Numbered List">
              <Button
                size="small"
                icon={<OrderedListOutlined />}
                onClick={() => insertMarkdown('1. ', '', 'List item')}
              />
            </Tooltip>
          </Space>

          <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />

          <Space size={4}>
            <Tooltip title="Link">
              <Button
                size="small"
                icon={<LinkOutlined />}
                onClick={() =>
                  insertMarkdown('[', '](url)', 'link text')
                }
              />
            </Tooltip>
            <Tooltip title="Image">
              <Button
                size="small"
                icon={<PictureOutlined />}
                onClick={() =>
                  insertMarkdown('![', '](image-url)', 'alt text')
                }
              />
            </Tooltip>
          </Space>

          <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />

          <Space size={4}>
            <Tooltip title="Inline Code">
              <Button
                size="small"
                icon={<CodeOutlined />}
                onClick={() => insertMarkdown('`', '`', 'code')}
              />
            </Tooltip>
            <Tooltip title="Code Block">
              <Button
                size="small"
                onClick={() => insertMarkdown('```\n', '\n```', 'code block')}
              >
                {'</>'}
              </Button>
            </Tooltip>
          </Space>

          <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />

          <Space size={4}>
            <Tooltip title="Quote">
              <Button
                size="small"
                onClick={() => insertMarkdown('> ', '', 'quote')}
              >
                &quot;
              </Button>
            </Tooltip>
            <Tooltip title="Horizontal Rule">
              <Button
                size="small"
                onClick={() => insertMarkdown('\n---\n', '', '')}
              >
                ―
              </Button>
            </Tooltip>
          </Space>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto' }} ref={editorRef}>
        <CodeEditor
          value={value}
          language="markdown"
          placeholder="Start typing your markdown here..."
          onChange={handleEditorChange}
          readOnly={readOnly}
          padding={16}
          style={{
            fontSize: 14,
            backgroundColor: '#fafafa',
            fontFamily:
              'Monaco, Menlo, Ubuntu Mono, Consolas, source-code-pro, monospace',
            color: '#2e2e2e',
          }}
          className="markdown-editor"
        />
      </div>
    </div>
  );
}
