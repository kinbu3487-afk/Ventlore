import DataMapPage from '@/app/data-map/page';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((loc) => ({ locale: loc.code }));
}

export default DataMapPage;
