import { redirect } from 'next/navigation';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/i18n';

export default async function RootPage() {
  let targetLocale = DEFAULT_LOCALE;

  if (process.env.STATIC_EXPORT !== 'true') {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const savedLocale = cookieStore.get('ventlore_locale')?.value;
      if (savedLocale && SUPPORTED_LOCALES.some((l) => l.code === savedLocale)) {
        targetLocale = savedLocale as any;
      }
    } catch {
      targetLocale = DEFAULT_LOCALE;
    }
  }

  redirect(`/${targetLocale}/`);
}
