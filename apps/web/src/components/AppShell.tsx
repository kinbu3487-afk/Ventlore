'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from './SessionContext';
import { useI18n } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DemoPersona } from '@ventlore/api-client';
import {
  CompassIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserIcon,
  Menu,
  CloseIcon,
  ChevronDownIcon,
} from './Icons';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { persona, session, setPersona } = useSession();
  const { t, getLocalizedPath } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/explore', label: t('nav.explore'), icon: <CompassIcon className="w-5 h-5" /> },
    { href: '/vip', label: t('nav.vip'), icon: <SparklesIcon className="w-5 h-5" /> },
    { href: '/transparency', label: t('nav.transparency'), icon: <ShieldCheckIcon className="w-5 h-5" /> },
  ];

  const personas: Array<{ id: DemoPersona; name: string; tag: string }> = [
    { id: 'guest', name: 'Khách (Guest)', tag: 'PUBLIC_READ' },
    { id: 'member', name: 'Bin Khám Phá', tag: 'MEMBER' },
    { id: 'vip', name: 'An Thám Hiểm VIP', tag: 'VIP_ACTIVE' },
    { id: 'author', name: 'Minh Hướng Dẫn Viên', tag: 'AUTHOR' },
    { id: 'expert', name: 'Hoàng Kiểm Lâm', tag: 'EXPERT' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-canvas text-ink">
      {/* 1. Global Demo Notification Banner */}
      <aside
        aria-label="Demo environment announcement"
        className="bg-[#122e27] text-ivory/90 text-xs py-1.5 px-4 text-center font-medium border-b border-white/10"
      >
        <span className="inline-block mr-2 px-1.5 py-0.2 rounded bg-amber text-ink font-bold text-[10px]">
          DEMO
        </span>
        {t('common.demoNotice')}
      </aside>

      {/* 2. Top Header Navigation (Forest Green #173F35 with Ivory Logo) */}
      <header className="sticky top-0 z-40 bg-[#173F35] text-ivory border-b border-[#1f4e42] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Brand Logo & Wordmark */}
            <div className="flex items-center gap-6 lg:gap-8">
              <Link
                href={getLocalizedPath('/explore')}
                className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-control"
              >
                <img
                  src="/brand/Ventlore_Logo_Ivory.png"
                  alt="Ventlore"
                  className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
                {navLinks.map((link) => {
                  const localizedHref = getLocalizedPath(link.href);
                  const isActive = pathname === localizedHref || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={localizedHref}
                      className={`min-h-control flex items-center gap-2 px-3.5 py-2 rounded-control text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-white/15 text-ivory font-bold shadow-xs'
                          : 'text-ivory/80 hover:text-ivory hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Language Switcher, Persona Switcher & User Account */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Persona Switcher (Dropdown for testing different permissions) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
                  className="min-h-control flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-control border border-white/20 bg-white/10 text-xs font-medium text-ivory hover:bg-white/15 transition-colors shadow-xs"
                  aria-label={t('common.switchRole')}
                >
                  <span className="hidden xl:inline text-ivory/70">{t('common.role')}:</span>
                  <span className="font-semibold text-ivory truncate max-w-[90px] sm:max-w-none">
                    {personas.find((p) => p.id === persona)?.name}
                  </span>
                  <ChevronDownIcon className="w-3.5 h-3.5 text-ivory/70 shrink-0" />
                </button>

                {personaDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-card border border-sage bg-surface-card p-2 shadow-xl z-50 text-ink">
                    <div className="px-3 py-2 border-b border-sage/60 text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
                      {t('common.switchRole')} (Demo)
                    </div>
                    <div className="py-1">
                      {personas.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setPersona(p.id);
                            setPersonaDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-control text-xs flex items-center justify-between transition-colors ${
                            persona === p.id
                              ? 'bg-forest text-white font-semibold'
                              : 'text-ink hover:bg-surface-canvas'
                          }`}
                        >
                          <span>{p.name}</span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                              persona === p.id ? 'bg-white/20 text-white' : 'bg-sage/60 text-ink-secondary'
                            }`}
                          >
                            {p.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Login / Profile Button */}
              {persona === 'guest' ? (
                <Link
                  href={getLocalizedPath(`/login?returnTo=${encodeURIComponent(pathname)}`)}
                  className="min-h-control inline-flex items-center justify-center px-3.5 py-2 rounded-control text-xs font-semibold text-forest bg-ivory hover:bg-white transition-colors shadow-sm"
                >
                  {t('nav.login')}
                </Link>
              ) : (
                <Link
                  href={getLocalizedPath(session?.handle ? `/people/${session.handle}` : '/explore')}
                  className="min-h-control flex items-center gap-2 p-1.5 sm:px-3 rounded-control border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-medium text-ivory transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-ivory text-forest flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                    {session?.avatarUrl ? (
                      <img
                        src={session.avatarUrl}
                        alt={session.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="hidden sm:inline font-semibold">{session?.displayName}</span>
                </Link>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden min-h-control p-2 rounded-control text-ivory/80 hover:text-ivory hover:bg-white/10"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1f4e42] bg-[#173F35] px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => {
              const localizedHref = getLocalizedPath(link.href);
              const isActive = pathname === localizedHref || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={localizedHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-control flex items-center gap-3 px-4 py-3 rounded-control text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-white/20 text-ivory'
                      : 'text-ivory/80 hover:bg-white/10 text-ivory'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-12">
        {children}
      </main>

      {/* 4. Mobile Bottom Navigation Bar (Touch target >= 44px) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-card border-t border-sage shadow-lg flex items-center justify-around h-16 px-2"
      >
        {navLinks.map((link) => {
          const localizedHref = getLocalizedPath(link.href);
          const isActive = pathname === localizedHref || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={localizedHref}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center text-[11px] font-medium transition-colors ${
                isActive ? 'text-forest font-bold' : 'text-ink-secondary hover:text-ink'
              }`}
            >
              {link.icon}
              <span className="mt-0.5">{link.label}</span>
            </Link>
          );
        })}

        <Link
          href={getLocalizedPath(
            persona === 'guest'
              ? '/login'
              : session?.handle
              ? `/people/${session.handle}`
              : '/explore'
          )}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center text-[11px] font-medium transition-colors ${
            pathname.includes('/login') || pathname.includes('/people')
              ? 'text-forest font-bold'
              : 'text-ink-secondary hover:text-ink'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="mt-0.5">{persona === 'guest' ? t('nav.login') : t('nav.profile')}</span>
        </Link>
      </nav>

      {/* 5. Footer */}
      <footer className="hidden md:block border-t border-sage bg-surface-card mt-auto py-8 text-xs text-ink-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/brand/Ventlore_Logo_Forest.png"
              alt="Ventlore"
              className="h-6 w-auto grayscale opacity-80"
            />
            <span>© 2026 Ventlore Foundation. {t('common.tagline')}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href={getLocalizedPath('/explore')} className="hover:text-forest">
              {t('nav.explore')}
            </Link>
            <Link href={getLocalizedPath('/vip')} className="hover:text-forest">
              {t('nav.vip')}
            </Link>
            <Link href={getLocalizedPath('/transparency')} className="hover:text-forest">
              {t('nav.transparency')}
            </Link>
            <Link href={getLocalizedPath('/login')} className="hover:text-forest">
              {t('nav.login')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
