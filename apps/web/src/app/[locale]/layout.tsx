import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SUPPORTED_LOCALES, SupportedLocale } from '@/lib/i18n';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: SupportedLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteTaglines: Record<SupportedLocale, string> = {
    vi: 'Ventlore - Hiểu nơi đến. Vững bước đi.',
    en: 'Ventlore - Understand Your Trail. Step with Confidence.',
    ja: 'Ventlore - 旅先を深く知り、確かな一歩を。',
    'zh-Hans': 'Ventlore - 洞悉前路，行步坚定。',
    ko: 'Ventlore - 목적지를 이해하고, 확신을 갖고 나아가다.',
    fr: 'Ventlore - Comprendre sa destination. Avancer en confiance.',
  };
  const descriptions: Record<SupportedLocale, string> = {
    vi: 'Nền tảng kiểm định và chia sẻ trải nghiệm du lịch mạo hiểm phi tập trung.',
    en: 'Decentralized adventure verification and field exploration platform.',
    ja: '分散型のアドベンチャー検証および現地調査プラットフォーム。',
    'zh-Hans': '去中心化探险核验与实地探索共建平台。',
    ko: '탈중앙화 모험 검증 및 현장 탐험 공유 플랫폼.',
    fr: 'Plateforme décentralisée de vérification d’aventure et d’exploration de terrain.',
  };
  return {
    title: siteTaglines[locale] || siteTaglines.vi,
    description: descriptions[locale] || descriptions.vi,
  };
}

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
