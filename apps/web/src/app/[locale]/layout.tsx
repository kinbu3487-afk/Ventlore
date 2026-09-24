import type { ReactNode } from 'react';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale: locale.code }));
}

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
