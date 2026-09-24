import type { Metadata } from 'next';
import type { ReactNode } from 'react';

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
      <body>{children}</body>
    </html>
  );
}
