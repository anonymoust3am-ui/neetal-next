'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FaArrowUpRightFromSquare,
  FaBell,
  FaBullhorn,
  FaCalendarCheck,
  FaCircleCheck,
  FaFileLines,
  FaImage,
  FaLink,
  FaRegBell,
  FaTriangleExclamation,
} from 'react-icons/fa6';

type NotificationKind = 'all' | 'deadline' | 'notice' | 'result' | 'system';

type NotificationAction = {
  label: string;
  href: string;
  primary?: boolean;
};

type NotificationItem = {
  id: string;
  kind: Exclude<NotificationKind, 'all'>;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  important?: boolean;
  image?: string;
  link?: {
    label: string;
    href: string;
  };
  actions?: NotificationAction[];
  meta?: string[];
};

const filters: { key: NotificationKind; label: string; icon: IconType }[] = [
  { key: 'all', label: 'All', icon: FaBell },
  { key: 'deadline', label: 'Deadlines', icon: FaCalendarCheck },
  { key: 'notice', label: 'Notices', icon: FaBullhorn },
  { key: 'result', label: 'Results', icon: FaCircleCheck },
  { key: 'system', label: 'System', icon: FaRegBell },
];

const kindStyle: Record<Exclude<NotificationKind, 'all'>, { label: string; icon: IconType; tone: string }> = {
  deadline: { label: 'Deadline', icon: FaCalendarCheck, tone: 'text-warning bg-warning/10 border-warning/20' },
  notice: { label: 'Notice', icon: FaBullhorn, tone: 'text-primary bg-primary/10 border-primary/20' },
  result: { label: 'Result', icon: FaCircleCheck, tone: 'text-success bg-success/10 border-success/20' },
  system: { label: 'System', icon: FaRegBell, tone: 'text-info bg-info/10 border-info/20' },
};

const notifications: NotificationItem[] = [
  {
    id: 'round-2-choice-locking',
    kind: 'deadline',
    title: 'Round 2 choice locking closes tonight',
    body: 'Choice locking for MCC Round 2 is expected to close soon. Review your list and keep a final copy before the portal window ends.',
    time: '12 min ago',
    unread: true,
    important: true,
    link: { label: 'Open official MCC counselling portal', href: 'https://mcc.nic.in' },
    actions: [
      { label: 'Open Choice List', href: '/dashboard/choices', primary: true },
      { label: 'Check Predictor', href: '/dashboard/predictor' },
    ],
    meta: ['MCC', 'Round 2', 'Action needed'],
  },
  {
    id: 'college-data-refresh',
    kind: 'notice',
    title: 'College fee and bond data refreshed',
    body: 'We updated fee, bond, stipend, and hostel fields for selected government and deemed institutes. Compare pages now include the latest local snapshot.',
    time: '1 hour ago',
    unread: true,
    image: '/og-one.png',
    actions: [
      { label: 'Browse Colleges', href: '/dashboard/colleges', primary: true },
      { label: 'Compare Now', href: '/dashboard/compare' },
    ],
    meta: ['Fees', 'Bond', 'Hostel'],
  },
  {
    id: 'allotment-letter',
    kind: 'result',
    title: 'Allotment result checklist is ready',
    body: 'Your post-allotment document checklist is available. Use it to track reporting documents, fee receipts, ID proof, and college-specific instructions.',
    time: 'Yesterday',
    link: { label: 'View reporting checklist', href: '/dashboard/allotment' },
    actions: [{ label: 'View Allotment Tools', href: '/dashboard/allotment', primary: true }],
    meta: ['Checklist', 'Reporting'],
  },
  {
    id: 'profile-completion',
    kind: 'system',
    title: 'Complete profile to personalize alerts',
    body: 'Add your category, domicile, preferred course, and score so Neetell can prioritize only relevant counselling alerts.',
    time: '2 days ago',
    actions: [{ label: 'Complete Profile', href: '/dashboard/profile', primary: true }],
    meta: ['Personalization'],
  },
  {
    id: 'state-counselling-guide',
    kind: 'notice',
    title: 'New state counselling guide added',
    body: 'A new guide explains domicile rules, document verification flow, seat categories, and likely participation strategy for state counselling.',
    time: '3 days ago',
    image: '/og-two.png',
    link: { label: 'Read state counselling guide', href: '/dashboard/counselling' },
    actions: [{ label: 'Open Guide', href: '/dashboard/counselling', primary: true }],
    meta: ['State quota', 'Guide'],
  },
];

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function NotificationCard({ item }: { item: NotificationItem }) {
  const style = kindStyle[item.kind];
  const KindIcon = style.icon;

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-surface p-4 shadow-sm transition-colors hover:border-primary/40 sm:p-5',
        item.unread ? 'border-primary/30' : 'border-border'
      )}
    >
      {item.unread && <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary" />}

      <div className="flex gap-3 sm:gap-4">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', style.tone)}>
          <KindIcon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 pr-4">
            <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', style.tone)}>
              {style.label}
            </span>
            {item.important && (
              <span className="inline-flex items-center gap-1 rounded-full border border-error/20 bg-error/10 px-2 py-0.5 text-[10px] font-bold text-error">
                <FaTriangleExclamation size={10} /> Important
              </span>
            )}
            <span className="text-[11px] font-semibold text-foreground-subtle">{item.time}</span>
          </div>

          <h2 className="mt-2 text-sm font-black leading-snug text-foreground sm:text-base">
            {item.title}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-foreground-muted sm:text-sm">
            {item.body}
          </p>

          {item.image && (
            <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted">
              <img src={item.image} alt="" className="h-32 w-full object-cover sm:h-44" />
            </div>
          )}

          {item.link && (
            <Link
              href={item.link.href}
              target={item.link.href.startsWith('http') ? '_blank' : undefined}
              rel={item.link.href.startsWith('http') ? 'noreferrer' : undefined}
              className="mt-3 flex min-w-0 items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-xs font-semibold text-primary hover:bg-hover"
            >
              <FaLink className="shrink-0" size={12} />
              <span className="truncate">{item.link.label}</span>
              <FaArrowUpRightFromSquare className="ml-auto shrink-0" size={10} />
            </Link>
          )}

          {item.meta && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.meta.map(tag => (
                <span key={tag} className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold text-foreground-subtle">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {item.actions && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              {item.actions.map(action => (
                <Link
                  key={action.href + action.label}
                  href={action.href}
                  className={cn(
                    'inline-flex h-10 items-center justify-center rounded-xl px-4 text-xs font-black transition-colors',
                    action.primary
                      ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                      : 'border border-border bg-surface text-foreground-muted hover:bg-hover hover:text-foreground'
                  )}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<NotificationKind>('all');

  const visibleNotifications = useMemo(
    () => notifications.filter(item => activeFilter === 'all' || item.kind === activeFilter),
    [activeFilter]
  );

  const unreadCount = notifications.filter(item => item.unread).length;
  const importantCount = notifications.filter(item => item.important).length;

  return (
    <main className="min-h-screen bg-background pb-28">
      <section className="border-b border-border bg-surface px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaBell size={16} />
              </span>
              <span className="rounded-full bg-primary-light px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
                Notification Center
              </span>
            </div>
            <h1 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
              Updates, Notices & Deadlines
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-foreground-muted">
              Rich alerts for counselling deadlines, college data changes, results, official links, images, and action items.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <div className="rounded-2xl border border-border bg-background px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-subtle">Unread</p>
              <p className="mt-1 text-xl font-black text-foreground">{unreadCount}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-subtle">Important</p>
              <p className="mt-1 text-xl font-black text-error">{importantCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1300px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2 px-1">
              <FaFileLines size={13} className="text-foreground-subtle" />
              <p className="text-xs font-black uppercase tracking-wider text-foreground-subtle">Filter</p>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible">
              {filters.map(filter => {
                const Icon = filter.icon;
                const active = activeFilter === filter.key;

                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    className={cn(
                      'flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-bold transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-foreground-muted hover:bg-hover hover:text-foreground'
                    )}
                  >
                    <Icon size={13} />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 hidden rounded-2xl border border-border bg-surface p-4 shadow-sm lg:block">
            <div className="flex items-center gap-2 text-primary">
              <FaImage size={14} />
              <p className="text-xs font-black uppercase tracking-wider">Rich Widgets</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-foreground-muted">
              Notifications can include images, links, tags, external URLs, and multiple CTA actions.
            </p>
          </div>
        </aside>

        <div className="space-y-3">
          {visibleNotifications.map(item => (
            <NotificationCard key={item.id} item={item} />
          ))}

          {visibleNotifications.length === 0 && (
            <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-foreground-subtle">
                <FaRegBell size={20} />
              </div>
              <p className="mt-4 text-sm font-black text-foreground">No notifications here</p>
              <p className="mt-1 text-xs text-foreground-muted">Try another filter to see more updates.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
