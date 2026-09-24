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

  // Set html lang attribute and localized document title
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;

      const siteTaglines: Record<SupportedLocale, string> = {
        vi: 'Ventlore - Hiểu nơi đến. Vững bước đi.',
        en: 'Ventlore - Understand Your Trail. Step with Confidence.',
        ja: 'Ventlore - 旅先を深く知り、確かな一歩を。',
        'zh-Hans': 'Ventlore - 洞悉前路，行步坚定。',
        ko: 'Ventlore - 목적지를 이해하고, 확신을 갖고 나아가다.',
        fr: 'Ventlore - Comprendre sa destination. Avancer en confiance.',
      };

      const routeTitles: Record<string, Record<SupportedLocale, string>> = {
        explore: {
          vi: 'Khám phá điểm đến | Ventlore',
          en: 'Explore Destinations | Ventlore',
          ja: '目的地を探す | Ventlore',
          'zh-Hans': '探索目的地 | Ventlore',
          ko: '목적지 탐색 | Ventlore',
          fr: 'Explorer les destinations | Ventlore',
        },
        transparency: {
          vi: 'Minh bạch tài chính | Ventlore',
          en: 'Financial Transparency | Ventlore',
          ja: '財務の透明性 | Ventlore',
          'zh-Hans': '资金透明账本 | Ventlore',
          ko: '재정 투명성 | Ventlore',
          fr: 'Transparence financière | Ventlore',
        },
        vip: {
          vi: 'Gói hội viên VIP | Ventlore',
          en: 'VIP Membership Plan | Ventlore',
          ja: 'VIP会員プラン | Ventlore',
          'zh-Hans': 'VIP会员计划 | Ventlore',
          ko: 'VIP 멤버십 플랜 | Ventlore',
          fr: 'Adhésion VIP | Ventlore',
        },
        login: {
          vi: 'Đăng nhập | Ventlore',
          en: 'Sign In | Ventlore',
          ja: 'ログイン | Ventlore',
          'zh-Hans': '用户登录 | Ventlore',
          ko: '로그인 | Ventlore',
          fr: 'Connexion | Ventlore',
        },
      };

      const segments = pathname.split('/').filter(Boolean);
      const route = segments.length > 1 ? segments[1] : '';

      if (route && routeTitles[route]) {
        document.title = routeTitles[route][locale] || siteTaglines[locale];
      } else if (!route || route === '') {
        document.title = siteTaglines[locale];
      }
    }
  }, [pathname, locale]);

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
        const hasTrailingSlash = pathname.endsWith('/');
        const newPath = '/' + segments.join('/') + (hasTrailingSlash && segments.length === 1 ? '/' : '') + searchSuffix;
        router.push(newPath);
      } else {
        // Legacy path without prefix: redirect to new locale prefix path
        const newPath = `/${newLocale}${pathname === '/' ? '/' : pathname}${searchSuffix}`;
        router.push(newPath);
      }
    },
    [pathname, router]
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      // 1. Plural resolution if params has count
      let resolvedKey = key;
      if (params && typeof params.count === 'number') {
        const count = Number(params.count);
        const isOne = count === 1 || (locale === 'fr' && count === 0);
        const pluralKey = isOne ? `${key}_one` : `${key}_other`;
        const candidate =
          getNestedValue(catalogs[locale], pluralKey) ||
          getNestedValue(catalogs.en, pluralKey);
        if (candidate) {
          resolvedKey = pluralKey;
        }
      }

      // 2. Try active locale
      let text = getNestedValue(catalogs[locale], resolvedKey);
      // 3. Fallback to English
      if (!text && locale !== 'en') {
        text = getNestedValue(catalogs.en, resolvedKey);
      }
      // 4. Fallback to Vietnamese
      if (!text && locale !== 'vi') {
        text = getNestedValue(catalogs.vi, resolvedKey);
      }
      // 5. Fallback to original key if plural key had no direct match
      if (!text && resolvedKey !== key) {
        text =
          getNestedValue(catalogs[locale], key) ||
          getNestedValue(catalogs.en, key) ||
          getNestedValue(catalogs.vi, key);
      }
      // 6. Handle missing key
      if (!text) {
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
          console.warn(`[i18n] Missing key "${key}" for locale "${locale}"`);
        }
        const lastPart = key.split('.').pop() || key;
        text = lastPart
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
      }

      // 7. Dynamic English & French Plural grammar correction for common nouns
      if (params && typeof params.count === 'number') {
        const count = Number(params.count);
        if (count === 1) {
          if (locale === 'en') {
            text = text
              .replace(/1 field posts/gi, '1 field post')
              .replace(/1 destinations/gi, '1 destination');
          } else if (locale === 'fr') {
            text = text
              .replace(/1 destinations/gi, '1 destination')
              .replace(/1 articles de terrain/gi, '1 article de terrain');
          }
        }
      }

      // Interpolation: replace {name} with params.name
      if (params) {
        Object.entries(params).forEach(([paramKey, val]) => {
          text = text!.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
        });
        if (typeof params.count === 'number' && Number(params.count) === 1) {
          if (locale === 'en') {
            text = text
              .replace(/1 field posts/gi, '1 field post')
              .replace(/1 destinations/gi, '1 destination');
          } else if (locale === 'fr') {
            text = text
              .replace(/1 destinations/gi, '1 destination')
              .replace(/1 articles de terrain/gi, '1 article de terrain');
          }
        }
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
          timeZone: 'UTC', // Ensure consistent date display without local timezone rollover discrepancies
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
      if (stripped === '/' || stripped === '') {
        return `/${loc}/`;
      }
      if (stripped === '/explore' || stripped === '/explore/') {
        return `/${loc}/explore/`;
      }
      return `/${loc}${stripped.startsWith('/') ? stripped : `/${stripped}`}`;
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
