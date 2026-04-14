'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Search,
  Bookmark,
  Bell,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { useSidebar, SIDEBAR_COLLAPSED_W, SIDEBAR_EXPANDED_W, HEADER_H } from '@/contexts/SidebarContext';
import { ThemeToggle } from '../ThemeToggle';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ── tiny reusable icon-button ──────────────────────────────────── */
function IconBtn({
  children,
  badge,
  badgeDot,
  onClick,
  title,
}: {
  children: React.ReactNode;
  badge?: string | number;
  badgeDot?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="relative p-2 rounded-xl hover:bg-[var(--color-bg-hover)] text-[var(--color-icon-secondary)] hover:text-[var(--color-icon-primary)] transition-colors"
    >
      {children}
      {badge && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
          {badge}
        </span>
      )}
      {badgeDot && !badge && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
      )}
    </button>
  );
}

/* ── Profile dropdown ───────────────────────────────────────────── */
const profileLinks = [
  { icon: User, label: 'My Profile', href: '/dashboard/profile' },
  { icon: CreditCard, label: 'My Plan', href: '/dashboard/plan' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { icon: HelpCircle, label: 'Support', href: '/dashboard/support' },
];

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-xl hover:bg-[var(--color-bg-hover)] transition-colors"
      >
        <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center shrink-0">
          <span className="text-[11px] font-bold text-primary">AS</span>
        </div>
        <ChevronDown
          size={13}
          className={cn(
            'text-[var(--color-icon-muted)] transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] w-52 bg-[var(--color-dropdown-bg)] border border-[var(--color-dropdown-border)] rounded-2xl shadow-lg py-1.5 z-[1050]">
          {/* User info */}
          <div className="px-4 py-2.5 border-b border-[var(--color-border)] mb-1">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Aryan Sharma</p>
            <p className="text-xs text-[var(--color-text-muted)]">aryan@example.com</p>
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
          <button className="flex items-center gap-3 px-4 py-2 w-full text-sm text-error hover:bg-[var(--color-error-light)] transition-colors">
            <LogOut size={14} className="shrink-0" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Counselling switcher ───────────────────────────────────────── */
function CounsellingSwitcher() {
  const [mode, setMode] = useState<'ug' | 'pg'>('ug');
  return (
    <div className="flex items-center bg-[var(--color-bg-muted)] rounded-xl p-[3px] gap-[2px]">
      {(['ug', 'pg'] as const).map(m => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
            mode === m
              ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
          )}
        >
          {m === 'ug' ? <Stethoscope size={11} /> : <Sparkles size={11} />}
          NEET {m.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ── Main header ────────────────────────────────────────────────── */
export function DashboardHeader() {
  const { expanded } = useSidebar();
  const sidebarW = expanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1030] flex items-center
    bg-[var(--color-navbar-bg)] border-b border-[var(--color-border)]"
      style={{ height: HEADER_H }}
    >
      {/* ── LEFT (logo + switcher + bookmark) ───────────────── */}
      <div
        className="flex items-center px-4 gap-3 shrink-0 border-r border-[var(--color-border)] h-full"
        style={{
          width: sidebarW,
          transition: 'width 240ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-sm font-bold leading-none">N</span>
          </div>

          {expanded && (
            <div>
              <p className="text-sm font-extrabold text-[var(--color-text-primary)]">
                NeEtal
              </p>
              <p className="text-[9px] text-[var(--color-text-muted)] uppercase">
                Medical Counselling
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* ── Right: utilities ──────────────────────────────────── */}
      <div className="flex items-center gap-1 px-4 shrink-0">
        {/* ALWAYS visible */}
        <CounsellingSwitcher />
      </div>

      {/* ── CENTER (search perfectly centered) ───────────────── */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-xl">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-icon-muted)]"
          />
          <input
            type="search"
            placeholder="Search colleges, states, courses…"
            className="w-full h-10 pl-9 pr-4 text-sm bg-[var(--color-bg-muted)]
        rounded-xl border border-transparent
        focus:border-[var(--color-border-focus)]
        focus:bg-[var(--color-input-bg)] outline-none"
          />
        </div>
      </div>

      {/* ── RIGHT (actions) ───────────────── */}
      <div className="flex items-center gap-2 px-4 shrink-0">
        <IconBtn badge={5} title="My Shortlist">
          <Bookmark size={18} />
        </IconBtn>
        {/* Notifications */}
        <IconBtn badgeDot title="Updates & Notices">
          <Bell size={18} />
        </IconBtn>

        <ThemeToggle showLabel={true} height={30}/>

        {/* CTA */}
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold
      px-3.5 py-2 rounded-xl hover:bg-[var(--color-primary-hover)] shadow-sm">
          <Sparkles size={13} />
          Get Guidance
        </button>

        {/* Profile */}
        <ProfileMenu />
      </div>
    </header>
  );
}
