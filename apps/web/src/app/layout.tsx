import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SessionProvider } from '@/components/SessionContext';
import { I18nProvider } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ventlore - Hiểu nơi đến. Vững bước đi.',
  description: 'Nền tảng kiểm định và chia sẻ trải nghiệm du lịch mạo hiểm phi tập trung.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-surface-canvas text-ink antialiased">
        <SessionProvider>
          <I18nProvider>{children}</I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
