import AccountPage from '@/app/account/page';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((loc) => ({ locale: loc.code }));
}

export default AccountPage;
