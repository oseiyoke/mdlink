'use client';

import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

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
  return (
    <CodeEditor
      value={value}
      language="markdown"
      placeholder="Start typing your markdown here..."
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      padding={16}
      style={{
        fontSize: 14,
        backgroundColor: '#fafafa',
        fontFamily:
          'Monaco, Menlo, Ubuntu Mono, Consolas, source-code-pro, monospace',
        minHeight: '100%',
        height: '100%',
      }}
      className="markdown-editor"
    />
  );
}
