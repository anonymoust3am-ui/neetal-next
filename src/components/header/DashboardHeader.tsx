'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  HelpCircle,
  LogOut,
  Sparkles,
  Newspaper,
} from 'lucide-react';
import { useSidebar, SIDEBAR_COLLAPSED_W, SIDEBAR_EXPANDED_W, HEADER_H } from '@/contexts/SidebarContext';
import { useTheme } from '@/hooks/useTheme';
import { CounsellingDropdown } from './CounsellingDropDown';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { resolveApiAssetUrl } from '@/lib/api';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ── Inline Theme Toggle ───────────────────────────────────────────── */
function InlineThemeToggle() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'Auto' },
  ] as const;

  return (
    <div className="flex items-center bg-[var(--color-bg-muted)] rounded-xl p-[3px] gap-[2px] w-full">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={cn(
            'flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150',
            theme === opt.value
              ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ── Profile dropdown ───────────────────────────────────────────── */
const profileLinks = [
  { icon: User, label: 'My Profile', href: '/dashboard/profile' },
  { icon: HelpCircle, label: 'Support', href: '/dashboard/support' },
];

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  const profilePicUrl = resolveApiAssetUrl(user?.profilePic);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.replace('/auth');
  };

  return (
    <div ref={ref} className="relative">
      <button
        data-tour="top-profile"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-0.5 md:gap-1.5 p-1 md:px-1.5 md:py-1.5 rounded-xl transition-colors',
          open ? 'bg-[var(--color-bg-hover)]' : 'hover:bg-[var(--color-bg-hover)]'
        )}
      >
        <div className="w-7 h-7 overflow-hidden rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center shrink-0 border border-[var(--color-primary)]/10">
          {profilePicUrl ? (
            <img src={profilePicUrl} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[11px] font-bold text-primary">{initials}</span>
          )}
        </div>
        <ChevronDown
          size={12}
          className={cn(
            'text-[var(--color-icon-muted)] transition-transform duration-200 hidden xs:block',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] w-56 bg-[var(--color-dropdown-bg)] border border-[var(--color-dropdown-border)] rounded-2xl shadow-xl py-1.5 z-[1050]">
          <div className="px-4 py-2.5 border-b border-[var(--color-border)] mb-1">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{user?.name ?? '—'}</p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email ?? user?.phone ?? '—'}</p>
          </div>

          {profileLinks.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-dropdown-hover)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <Icon size={14} className="text-[var(--color-icon-secondary)] shrink-0" />
              {label}
            </Link>
          ))}

          <div className="mx-3 my-1 border-t border-[var(--color-border)]" />
          <div className="px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
              Appearance
            </p>
            <InlineThemeToggle />
          </div>

          <div className="mx-3 my-1 border-t border-[var(--color-border)]" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-error hover:bg-[var(--color-error-light)] transition-colors rounded-b-2xl"
          >
            <LogOut size={14} className="shrink-0" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Simple nav link (Hidden on Mobile) ─────────────────────────── */
function NavLink({ href, icon: Icon, label, tourId }: { href: string; icon: React.ElementType; label: string; tourId?: string }) {
  return (
    <Link
      data-tour={tourId}
      href={href}
      className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
    >
      <Icon size={14} className="text-[var(--color-icon-secondary)]" />
      {label}
    </Link>
  );
}

/* ── Header search bar (Hidden on Mobile) ───────────────── */
function SearchBar() {
  const [value, setValue] = useState('');
  const router = useRouter();

  const submit = () => {
    const q = value.trim();
    if (!q) return;
    router.push(`/dashboard/colleges?q=${encodeURIComponent(q)}`);
  };

  return (
    <div data-tour="top-search" className="hidden md:flex flex-1 justify-center px-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={submit}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-icon-muted)] hover:text-[var(--color-icon-primary)] transition-colors"
        >
          <Search size={15} />
        </button>
        <input
          type="search"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Search colleges, states…"
          className="w-full h-9 pl-9 pr-4 text-sm bg-[var(--color-bg-muted)]
            rounded-xl border border-transparent
            focus:border-[var(--color-border-focus)]
            focus:bg-[var(--color-input-bg)] outline-none transition-colors"
        />
      </div>
    </div>
  );
}

/* ── Main header ────────────────────────────────────────────────── */
export function DashboardHeader() {
  const { expanded } = useSidebar();
  const sidebarW = expanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1030] flex items-center justify-between md:justify-start
        bg-[var(--color-navbar-bg)] border-b border-[var(--color-border)] px-4 md:px-0"
      style={{ height: HEADER_H }}
    >
      {/* ── LEFT SIDE: Brand Identity (Hidden on Mobile) ── */}
      <div
        className="hidden md:flex items-center shrink-0 border-r border-[var(--color-border)] h-full justify-start px-4 gap-3"
        style={{
          width: sidebarW,
          transition: 'width 240ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Link href="/dashboard" className="flex items-center">
          {expanded ? (
            <Image
              src="/logo-nobg.png"
              alt="NeEtal Full Logo"
              width={140}
              height={40}
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-10 h-10 overflow-hidden flex items-center justify-center">
              <Image
                src="/logo-outline.png"
                alt="NeEtal Icon"
                width={500}
                height={500}
                className="scale-[2] object-contain"
                priority
              />
            </div>
          )}
        </Link>
      </div>

      {/* ── CENTER AREA: Main Dropdown Navigation ── */}
      {/* Takes the left-aligned anchor on mobile for maximum neatness */}
      <div data-tour="top-counselling" className="flex items-center justify-start md:px-3 md:border-r md:border-[var(--color-border)] h-full">
        <CounsellingDropdown />
      </div>

      {/* ── DESKTOP ONLY CENTER COMPONENT: Search Bar ── */}
      <SearchBar />

      {/* ── RIGHT SIDE: Utility Tools + Profile Menu ── */}
      <div className="flex items-center gap-1.5 shrink-0 md:ml-auto md:px-3">
        
        {/* Nav links (Blogs, news, etc) */}
        <NavLink href="/dashboard/news" icon={Newspaper} label="Blogs & News" tourId="top-news" />

        {/* Notification bell (Responsive sizing) */}
        <Link
          data-tour="top-notifications"
          href="/dashboard/notifications"
          title="Updates & Notices"
          className="relative p-1.5 md:p-2 rounded-xl hover:bg-[var(--color-bg-hover)] text-[var(--color-icon-secondary)] hover:text-[var(--color-icon-primary)] transition-colors"
        >
          <Bell size={16} className="md:w-[18px] md:h-[18px]" />
          <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-error rounded-full" />
        </Link>

        {/* Small Expert Icon Button for Mobile */}
        <button 
          title="Talk to Expert"
          className="block md:hidden p-1.5 rounded-xl bg-[var(--color-primary-light)] text-primary hover:bg-primary/20 transition-colors"
        >
          <Sparkles size={16} />
        </button>

        {/* Vertical Divider line */}
        <div className="w-px h-5 md:h-6 bg-[var(--color-border)] mx-0.5 md:mx-1" />

        {/* Primary Expert CTA Action Button (Desktop Only) */}
        <button data-tour="top-expert" className="hidden md:flex items-center gap-1.5 bg-primary text-white text-xs font-semibold
          px-3.5 py-2 rounded-xl hover:bg-[var(--color-primary-hover)] shadow-sm transition-colors">
          <Sparkles size={13} />
          Talk to Expert
        </button>

        {/* Desktop context Divider */}
        <div className="hidden md:block w-px h-6 bg-[var(--color-border)] mx-1" />

        {/* Interactive Profile Dropdown Component */}
        <ProfileMenu />
      </div>
    </header>
  );
}
