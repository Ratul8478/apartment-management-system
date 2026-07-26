import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'FinTrack Pro — Full Corporate Finance Management System',
  description: 'Single-company internal finance dashboard, P&L reporting, employee directory, share value tracker, and AI assistant.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-surface-bg text-text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
