'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  Sparkles,
  Stethoscope,
  Microscope,
  FlaskConical,
  Phone,
  Newspaper,
} from 'lucide-react';
import { useSidebar, SIDEBAR_COLLAPSED_W, SIDEBAR_EXPANDED_W, HEADER_H } from '@/contexts/SidebarContext';
import { useTheme } from '@/hooks/useTheme';
import { CounsellingDropdown } from './CounsellingDropDown';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ── Counselling type options ───────────────────────────────────── */
const COUNSELLING_OPTIONS = [
  { value: 'neet-ug',   label: 'NEET UG',   icon: Stethoscope,  desc: 'MBBS / BDS / BAMS' },
  { value: 'neet-pg',   label: 'NEET PG',   icon: Sparkles,     desc: 'MD / MS / Diploma' },
  { value: 'neet-ss',   label: 'NEET SS',   icon: Microscope,   desc: 'Super Speciality' },
  { value: 'aiapget',   label: 'AIAPGET',   icon: FlaskConical, desc: 'Ayush PG Entrance' },
] as const;

type CounsellingValue = typeof COUNSELLING_OPTIONS[number]['value'];

// function CounsellingDropdown() {
//   const [selected, setSelected] = useState<CounsellingValue>('neet-ug');
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   const current = COUNSELLING_OPTIONS.find(o => o.value === selected)!;
//   const Icon = current.icon;

//   useEffect(() => {
//     if (!open) return;
//     const handler = (e: MouseEvent) => {
//       if (!ref.current?.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, [open]);

//   return (
//     <div ref={ref} className="relative">
//       <button
//         onClick={() => setOpen(v => !v)}
//         className={cn(
//           'flex items-center gap-2 h-9 px-3 rounded-xl border transition-all text-sm font-semibold',
//           open
//             ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-primary'
//             : 'bg-[var(--color-bg-muted)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
//         )}
//       >
//         <Icon size={13} className="text-primary shrink-0" />
//         <span>{current.label}</span>
//         <ChevronDown
//           size={12}
//           className={cn(
//             'text-[var(--color-icon-muted)] transition-transform duration-200 ml-0.5',
//             open && 'rotate-180'
//           )}
//         />
//       </button>

//       {open && (
//         <div className="absolute left-0 top-[calc(100%+6px)] w-56 bg-[var(--color-dropdown-bg)] border border-[var(--color-dropdown-border)] rounded-2xl shadow-lg py-1.5 z-[1050]">
//           <p className="px-4 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
//             Select Counselling
//           </p>
//           {COUNSELLING_OPTIONS.map(opt => {
//             const OptIcon = opt.icon;
//             const isActive = selected === opt.value;
//             return (
//               <button
//                 key={opt.value}
//                 onClick={() => { setSelected(opt.value); setOpen(false); }}
//                 className={cn(
//                   'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
//                   isActive
//                     ? 'bg-[var(--color-primary-light)] text-primary'
//                     : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-dropdown-hover)] hover:text-[var(--color-text-primary)]'
//                 )}
//               >
//                 <div className={cn(
//                   'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
//                   isActive ? 'bg-primary' : 'bg-[var(--color-bg-muted)]'
//                 )}>
//                   <OptIcon size={13} className={isActive ? 'text-white' : 'text-[var(--color-icon-secondary)]'} />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-semibold leading-none">{opt.label}</p>
//                   <p className={cn('text-[10px] mt-0.5', isActive ? 'text-primary/70' : 'text-[var(--color-text-muted)]')}>
//                     {opt.desc}
//                   </p>
//                 </div>
//                 {isActive && (
//                   <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

/* ── Inline Theme Toggle (for inside profile menu) ──────────────── */
function InlineThemeToggle() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: 'light', label: 'Light' },
    { value: 'dark',  label: 'Dark'  },
    { value: 'system',label: 'Auto'  },
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
  { icon: User,       label: 'My Profile', href: '/dashboard/profile' },
  { icon: CreditCard, label: 'My Plan',    href: '/dashboard/plan'    },
  { icon: Settings,   label: 'Settings',  href: '/dashboard/settings' },
  { icon: HelpCircle, label: 'Support',   href: '/dashboard/support'  },
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
        className={cn(
          'flex items-center gap-1.5 px-1.5 py-1.5 rounded-xl transition-colors',
          open ? 'bg-[var(--color-bg-hover)]' : 'hover:bg-[var(--color-bg-hover)]'
        )}
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
        <div className="absolute right-0 top-[calc(100%+6px)] w-56 bg-[var(--color-dropdown-bg)] border border-[var(--color-dropdown-border)] rounded-2xl shadow-lg py-1.5 z-[1050]">
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

          {/* Theme toggle inside dropdown */}
          <div className="mx-3 my-1 border-t border-[var(--color-border)]" />
          <div className="px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
              Appearance
            </p>
            <InlineThemeToggle />
          </div>

          <div className="mx-3 my-1 border-t border-[var(--color-border)]" />
          <button className="flex items-center gap-3 px-4 py-2 w-full text-sm text-error hover:bg-[var(--color-error-light)] transition-colors rounded-b-2xl">
            <LogOut size={14} className="shrink-0" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Simple nav link ────────────────────────────────────────────── */
function NavLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
    >
      <Icon size={14} className="text-[var(--color-icon-secondary)]" />
      {label}
    </Link>
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
      {/* ── LEFT: Logo ──────────────────────────────────────────── */}
      <div
        className="flex items-center px-4 gap-3 shrink-0 border-r border-[var(--color-border)] h-full"
        style={{
          width: sidebarW,
          transition: 'width 240ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-sm font-bold leading-none">N</span>
          </div>
          {expanded && (
            <div>
              <p className="text-sm font-extrabold text-[var(--color-text-primary)]">NeEtal</p>
              <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wide">
                Medical Counselling
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* ── COUNSELLING DROPDOWN ─────────────────────────────────── */}
      <div className="flex items-center px-3 border-r border-[var(--color-border)] h-full">
        {/* <CounsellingDropdown /> */}
        <CounsellingDropdown />
      </div>

      {/* ── CENTER: Search ───────────────────────────────────────── */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-md">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-icon-muted)]"
          />
          <input
            type="search"
            placeholder="Search colleges, states, courses…"
            className="w-full h-9 pl-9 pr-4 text-sm bg-[var(--color-bg-muted)]
              rounded-xl border border-transparent
              focus:border-[var(--color-border-focus)]
              focus:bg-[var(--color-input-bg)] outline-none transition-colors"
          />
        </div>
      </div>

      {/* ── RIGHT: Nav + CTAs + Profile ─────────────────────────── */}
      <div className="flex items-center gap-1 px-3 shrink-0">

        {/* Nav links */}
        <NavLink href="/dashboard/blogs" icon={Newspaper} label="Blogs & News" />

        {/* Notification bell */}
        <button
          title="Updates & Notices"
          className="relative p-2 rounded-xl hover:bg-[var(--color-bg-hover)] text-[var(--color-icon-secondary)] hover:text-[var(--color-icon-primary)] transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--color-border)] mx-1" />

        {/* Call CTA */}
        {/* <a
          href="tel:+911800000000"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--color-border)]
            text-xs font-semibold text-[var(--color-text-secondary)]
            hover:border-primary hover:text-primary hover:bg-[var(--color-primary-light)]
            transition-all"
        >
          <Phone size={13} />
          Call
        </a> */}

        {/* Expert CTA */}
        <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold
          px-3.5 py-2 rounded-xl hover:bg-[var(--color-primary-hover)] shadow-sm transition-colors">
          <Sparkles size={13} />
          Talk to Expert
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--color-border)] mx-1" />

        {/* Profile with theme toggle inside */}
        <ProfileMenu />
      </div>
    </header>
  );
}