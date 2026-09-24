'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SupportedLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE, TranslationCatalog } from './types';
import { viCatalog } from './locales/vi';
import { enCatalog } from './locales/en';
import { jaCatalog } from './locales/ja';
import { zhHansCatalog } from './locales/zh-Hans';
import { koCatalog } from './locales/ko';
import { frCatalog } from './locales/fr';

const catalogs: Record<SupportedLocale, TranslationCatalog> = {
  vi: viCatalog,
  en: enCatalog,
  ja: jaCatalog,
  'zh-Hans': zhHansCatalog,
  ko: koCatalog,
  fr: frCatalog,
};

interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (newLocale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number) => string;
  formatCurrencyUsd: (centsOrDollars: number, isCents?: boolean) => string;
  getLocalizedPath: (path: string, targetLocale?: SupportedLocale) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: unknown, path: string): string | undefined {
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

function extractLocaleFromPath(pathname: string): SupportedLocale | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    const firstSegment = segments[0] as SupportedLocale;
    if (SUPPORTED_LOCALES.some((l) => l.code === firstSegment)) {
      return firstSegment;
    }
  }
  return null;
}

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: SupportedLocale;
}) {
  const pathname = usePathname() || '/';
  const router = useRouter();

  // Determine initial locale priority: path prefix > initial prop > cookie > default
  const pathLocale = extractLocaleFromPath(pathname);
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (pathLocale) return pathLocale;
    if (initialLocale && SUPPORTED_LOCALES.some((l) => l.code === initialLocale)) {
      return initialLocale;
    }
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)ventlore_locale=([^;]+)/);
      if (match && SUPPORTED_LOCALES.some((l) => l.code === match[1])) {
        return match[1] as SupportedLocale;
      }
    }
    return DEFAULT_LOCALE;
  });

  // Keep locale state in sync when URL changes
  useEffect(() => {
    if (pathLocale && pathLocale !== locale) {
      setLocaleState(pathLocale);
    }
  }, [pathLocale, locale]);

  // Set html lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback(
    (newLocale: SupportedLocale) => {
      if (!SUPPORTED_LOCALES.some((l) => l.code === newLocale)) return;
      setLocaleState(newLocale);

      // Persist in cookie (1 year)
      if (typeof document !== 'undefined') {
        document.cookie = `ventlore_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      }

      // If current path already has a locale prefix, swap it cleanly
      const currentPathLocale = extractLocaleFromPath(pathname);
      const searchSuffix =
        typeof window !== 'undefined' && window.location.search
          ? window.location.search
          : '';

      if (currentPathLocale) {
        // Replace current locale prefix with new one
        const segments = pathname.split('/').filter(Boolean);
        segments[0] = newLocale;
        const newPath = '/' + segments.join('/') + searchSuffix;
        router.push(newPath);
      } else {
        // Legacy path without prefix: redirect to new locale prefix path
        const newPath = `/${newLocale}${pathname === '/' ? '/explore' : pathname}${searchSuffix}`;
        router.push(newPath);
      }
    },
    [pathname, router]
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      // 1. Try active locale
      let text = getNestedValue(catalogs[locale], key);
      // 2. Fallback to English
      if (!text && locale !== 'en') {
        text = getNestedValue(catalogs.en, key);
      }
      // 3. Fallback to Vietnamese
      if (!text && locale !== 'vi') {
        text = getNestedValue(catalogs.vi, key);
      }
      // 4. Handle missing key
      if (!text) {
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
          console.warn(`[i18n] Missing key "${key}" for locale "${locale}"`);
        }
        // Human-readable fallback rather than raw dot-notation string
        const lastPart = key.split('.').pop() || key;
        text = lastPart
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
      }

      // Interpolation: replace {name} with params.name
      if (params) {
        Object.entries(params).forEach(([paramKey, val]) => {
          text = text!.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
        });
      }

      return text;
    },
    [locale]
  );

  const formatDate = useCallback(
    (date: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions): string => {
      if (!date) return '';
      try {
        const d = typeof date === 'string' ? new Date(date) : date;
        const defaultOptions: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          ...options,
        };
        const intlLocale = locale === 'zh-Hans' ? 'zh-CN' : locale;
        return new Intl.DateTimeFormat(intlLocale, defaultOptions).format(d);
      } catch {
        return String(date);
      }
    },
    [locale]
  );

  const formatNumber = useCallback(
    (value: number): string => {
      try {
        const intlLocale = locale === 'zh-Hans' ? 'zh-CN' : locale;
        return new Intl.NumberFormat(intlLocale).format(value);
      } catch {
        return String(value);
      }
    },
    [locale]
  );

  const formatCurrencyUsd = useCallback(
    (amount: number, isCents: boolean = true): string => {
      const dollars = isCents ? amount / 100 : amount;
      // In all locales, $15 remains 15 USD, just formatted cleanly
      if (locale === 'vi') return `${dollars} USD`;
      if (locale === 'fr') return `${dollars} USD`;
      if (locale === 'ja') return `$${dollars} (USD)`;
      if (locale === 'zh-Hans') return `$${dollars} 美元`;
      if (locale === 'ko') return `$${dollars} (USD)`;
      return `$${dollars}`;
    },
    [locale]
  );

  const getLocalizedPath = useCallback(
    (targetPath: string, targetLocale?: SupportedLocale): string => {
      const loc = targetLocale || locale;
      // Ensure targetPath starts with slash
      const cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
      // Remove any existing locale prefix
      const currentLoc = extractLocaleFromPath(cleanPath);
      let stripped = cleanPath;
      if (currentLoc) {
        stripped = cleanPath.replace(new RegExp(`^/${currentLoc}`), '') || '/';
      }
      if (stripped === '/') {
        return `/${loc}/explore`;
      }
      return `/${loc}${stripped}`;
    },
    [locale]
  );

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        formatDate,
        formatNumber,
        formatCurrencyUsd,
        getLocalizedPath,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
