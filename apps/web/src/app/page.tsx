import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/i18n';

export default async function HomePage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('ventlore_locale')?.value;
  const targetLocale =
    savedLocale && SUPPORTED_LOCALES.some((l) => l.code === savedLocale)
      ? savedLocale
      : DEFAULT_LOCALE;

  redirect(`/${targetLocale}/explore`);
}
