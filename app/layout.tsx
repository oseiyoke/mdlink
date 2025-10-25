import type { Metadata } from 'next';
import './globals.css';
import StyledComponentsRegistry from './registry';

export const metadata: Metadata = {
  title: 'MDLink - Markdown Editor',
  description: 'Create, edit, and share markdown documents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
