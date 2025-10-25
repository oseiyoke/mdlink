'use client';

import React from 'react';
import { ConfigProvider } from 'antd';

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3f3f3f',
          colorLink: '#4a4a4a',
          colorInfo: '#5a5a5a',
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
