import { HomePageView } from '@/components/HomePageView';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((loc) => ({ locale: loc.code }));
}

export default function LocaleHomePage() {
  return <HomePageView />;
}
