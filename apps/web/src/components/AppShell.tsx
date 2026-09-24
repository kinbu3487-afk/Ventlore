'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from './SessionContext';
import { DemoPersona } from '@ventlore/api-client';
import {
  CompassIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserIcon,
  Menu,
  CloseIcon,
  ChevronDownIcon,
  WalletIcon,
} from './Icons';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { persona, session, setPersona } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/explore', label: 'Khám phá', icon: <CompassIcon className="w-5 h-5" /> },
    { href: '/vip', label: 'Gói VIP', icon: <SparklesIcon className="w-5 h-5" /> },
    { href: '/transparency', label: 'Minh bạch quỹ', icon: <ShieldCheckIcon className="w-5 h-5" /> },
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
      <aside aria-label="Thông báo chế độ thử nghiệm" className="bg-forest text-ivory text-xs py-1.5 px-4 text-center font-medium border-b border-forest-hover">
        <span className="inline-block mr-2 px-1.5 py-0.2 rounded bg-amber text-ink font-bold text-[10px]">
          DEMO
        </span>
        Ventlore v0.3 UI Baseline • Mock Adapter • Dữ liệu mẫu không thay thế khuyến nghị an toàn thực địa.
      </aside>

      {/* 2. Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-surface-card/95 backdrop-blur-md border-b border-sage shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Brand Logo & Wordmark */}
            <div className="flex items-center gap-6">
              <Link href="/explore" className="flex items-center gap-3 group focus:outline-none">
                <img
                  src="/brand/Ventlore_Logo_Forest.png"
                  alt="Ventlore Logo"
                  className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center space-x-1" aria-label="Điều hướng chính">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`min-h-control flex items-center gap-2 px-4 py-2 rounded-control text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-forest/10 text-forest'
                          : 'text-ink-secondary hover:text-forest hover:bg-surface-canvas'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Persona Switcher & User Account */}
            <div className="flex items-center gap-3">
              {/* Persona Switcher (Dropdown for testing different permissions) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
                  className="min-h-control flex items-center gap-2 px-3 py-1.5 rounded-control border border-sage bg-surface-canvas text-xs font-medium text-ink hover:bg-sage/40 transition-colors shadow-xs"
                  aria-label="Chuyển đổi vai trò người dùng thử nghiệm"
                >
                  <span className="hidden sm:inline text-ink-muted">Vai trò:</span>
                  <span className="font-bold text-forest">
                    {personas.find((p) => p.id === persona)?.name}
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-ink-muted" />
                </button>

                {personaDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-card border border-sage bg-surface-card p-2 shadow-lg z-50">
                    <div className="px-3 py-2 border-b border-sage/60 text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
                      Chuyển đổi tài khoản (Demo)
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
                  href={`/login?returnTo=${encodeURIComponent(pathname)}`}
                  className="min-h-control inline-flex items-center justify-center px-4 py-2 rounded-control text-xs font-semibold text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
                >
                  Đăng nhập
                </Link>
              ) : (
                <Link
                  href={session?.handle ? `/people/${session.handle}` : '/explore'}
                  className="min-h-control flex items-center gap-2 p-1.5 sm:px-3 rounded-control border border-sage/80 bg-white hover:bg-surface-canvas text-xs font-medium text-ink transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
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
                className="md:hidden min-h-control p-2.5 rounded-control text-ink-secondary hover:text-ink hover:bg-surface-canvas"
                aria-label="Mở bảng điều hướng di động"
              >
                {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sage bg-surface-card px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-control flex items-center gap-3 px-4 py-3 rounded-control text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-forest/10 text-forest'
                      : 'text-ink-secondary hover:bg-surface-canvas'
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
        aria-label="Điều hướng nhanh di động"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-card border-t border-sage shadow-lg flex items-center justify-around h-16 px-2"
      >
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
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
          href={persona === 'guest' ? '/login' : session?.handle ? `/people/${session.handle}` : '/explore'}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center text-[11px] font-medium transition-colors ${
            pathname.startsWith('/login') || pathname.startsWith('/people')
              ? 'text-forest font-bold'
              : 'text-ink-secondary hover:text-ink'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="mt-0.5">{persona === 'guest' ? 'Đăng nhập' : 'Hồ sơ'}</span>
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
            <span>© 2026 Ventlore Foundation. Hiểu nơi đến. Vững bước đi.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/explore" className="hover:text-forest">Khám phá</Link>
            <Link href="/vip" className="hover:text-forest">Gói VIP</Link>
            <Link href="/transparency" className="hover:text-forest">Minh bạch quỹ</Link>
            <Link href="/login" className="hover:text-forest">Đăng nhập</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
