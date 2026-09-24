'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n, SUPPORTED_LOCALES, SupportedLocale } from '@/lib/i18n';
import { GlobeIcon, ChevronDownIcon, CheckIcon } from './Icons';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'light' | 'dark'; // 'dark' for forest green header, 'light' for white/canvas background
}

export function LanguageSwitcher({ className = '', variant = 'dark' }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currentLocaleObj = SUPPORTED_LOCALES.find((l) => l.code === locale) || SUPPORTED_LOCALES[0];

  const buttonStyle =
    variant === 'dark'
      ? 'bg-forest-light/60 hover:bg-forest-light text-ivory border-sage/30'
      : 'bg-white hover:bg-surface-canvas text-ink border-sage';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('common.languageSelectAria')}
        className={`min-h-control flex items-center gap-2 px-3 py-1.5 rounded-control border text-xs font-semibold transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-waypoint ${buttonStyle}`}
      >
        <GlobeIcon className="w-4 h-4 shrink-0 opacity-80" aria-hidden="true" />
        <span>{currentLocaleObj?.nativeName ?? 'Tiếng Việt'}</span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Danh sách ngôn ngữ được hỗ trợ"
          className="absolute right-0 mt-2 w-48 rounded-card border border-sage/80 bg-white py-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-3 py-1.5 border-b border-sage/40 text-[10px] font-bold text-ink-muted uppercase tracking-wider">
            Language / Ngôn ngữ
          </div>
          <div className="py-1">
            {SUPPORTED_LOCALES.map((item) => {
              const isSelected = item.code === locale;
              return (
                <button
                  key={item.code}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => {
                    setLocale(item.code as SupportedLocale);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-forest/10 text-forest font-bold'
                      : 'text-ink hover:bg-surface-canvas font-medium'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs">{item.nativeName}</span>
                    <span className="text-[10px] text-ink-muted">{item.name}</span>
                  </div>
                  {isSelected && <CheckIcon className="w-4 h-4 text-forest" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
