'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search, ChevronDown, ChevronRight,
  Calendar, Building2, Users, SlidersHorizontal,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx, { ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Types ────────────────────────────────────────────────────────────────────

type CounsellingStatus = 'open' | 'ongoing' | 'upcoming' | 'closed';

interface CounsellingEntry {
  id: string;
  title: string;
  type: 'Undergraduate' | 'Postgraduate';
  authority: string;
  description: string;
  status: CounsellingStatus;
  statusLabel: string;
  registrationDates: { start: string; end: string };
  stats: { totalSeats: number; participatingColleges: number };
  quotas: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DATA: CounsellingEntry[] = [
  {
    id: 'mcc-neet-ug',
    title: 'NEET UG Counselling 2025',
    type: 'Undergraduate',
    authority: 'MCC — Medical Counselling Committee',
    description: 'Centralized online counselling for 15% AIQ seats in all government medical and dental colleges across India.',
    status: 'upcoming',
    statusLabel: 'Round 1 Upcoming',
    registrationDates: { start: '15 Jun 2025', end: '30 Jun 2025' },
    stats: { totalSeats: 45000, participatingColleges: 612 },
    quotas: ['AIQ 15%', 'Central Universities', 'Deemed', 'AFMC'],
  },
  {
    id: 'aiims-counselling',
    title: 'AIIMS UG Counselling 2025',
    type: 'Undergraduate',
    authority: 'AIIMS New Delhi',
    description: 'Counselling for all MBBS seats across AIIMS institutes. Rank-based seat allotment through centralized process.',
    status: 'ongoing',
    statusLabel: 'Round 2 Open',
    registrationDates: { start: '10 Jul 2025', end: '20 Jul 2025' },
    stats: { totalSeats: 1207, participatingColleges: 23 },
    quotas: ['All AIIMS Seats', 'Open', 'SC/ST/OBC'],
  },
  {
    id: 'jipmer-counselling',
    title: 'JIPMER UG Counselling 2025',
    type: 'Undergraduate',
    authority: 'JIPMER Puducherry',
    description: 'Admission counselling for MBBS seats at JIPMER Puducherry and Karaikal through online centralized process.',
    status: 'open',
    statusLabel: 'Open',
    registrationDates: { start: '1 Jul 2025', end: '15 Jul 2025' },
    stats: { totalSeats: 200, participatingColleges: 2 },
    quotas: ['Open', 'SC', 'ST', 'OBC', 'Puducherry UT'],
  },
  {
    id: 'deemed-counselling',
    title: 'Deemed Universities Counselling 2025',
    type: 'Undergraduate',
    authority: 'MCC — Medical Counselling Committee',
    description: 'Counselling for all MBBS and BDS seats in deemed-to-be universities under MCC purview.',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    registrationDates: { start: '5 Aug 2025', end: '20 Aug 2025' },
    stats: { totalSeats: 28000, participatingColleges: 47 },
    quotas: ['All Deemed Seats', 'NRI', 'Management'],
  },
  {
    id: 'state-quota-ug',
    title: 'State Quota UG Counselling 2025',
    type: 'Undergraduate',
    authority: 'State Medical Authorities',
    description: '85% state quota seats in government and private medical colleges conducted by individual state authorities.',
    status: 'upcoming',
    statusLabel: 'Upcoming',
    registrationDates: { start: '1 Aug 2025', end: '31 Aug 2025' },
    stats: { totalSeats: 62000, participatingColleges: 380 },
    quotas: ['State Domicile', 'SC/ST/OBC', 'EWS'],
  },
  {
    id: 'mcc-neet-pg',
    title: 'NEET PG Counselling 2025',
    type: 'Postgraduate',
    authority: 'MCC — Medical Counselling Committee',
    description: 'Centralized counselling for 50% AIQ seats in MD/MS/PG Diploma courses at government medical colleges.',
    status: 'closed',
    statusLabel: 'Closed',
    registrationDates: { start: '10 Mar 2025', end: '25 Mar 2025' },
    stats: { totalSeats: 28500, participatingColleges: 290 },
    quotas: ['AIQ 50%', 'Central Institutes', 'ESIC/AVMC'],
  },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CounsellingStatus, { dot: string; badge: string; text: string }> = {
  open: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  ongoing: { dot: 'bg-primary', badge: 'bg-primary/5 border-primary/20', text: 'text-primary' },
  upcoming: { dot: 'bg-amber-400', badge: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  closed: { dot: 'bg-rose-400', badge: 'bg-rose-50 border-rose-200', text: 'text-rose-600' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FSelect({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-10 pl-3 pr-8 border border-border rounded-xl bg-background text-sm
          font-medium text-foreground appearance-none outline-none
          focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none" />
    </div>
  );
}

function CounsellingCard({ entry }: { entry: CounsellingEntry }) {
  const s = STATUS_CONFIG[entry.status];
  return (
    <div className="group bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3.5
      hover:border-primary/30 hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] transition-all duration-200">

      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* type + status row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground-subtle border border-border">
              {entry.type === 'Undergraduate' ? 'UG' : 'PG'}
            </span>
            <span className={cn(
              'inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border',
              s.badge, s.text
            )}>
              <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', s.dot)} />
              {entry.statusLabel}
            </span>
          </div>

          <h3 className="text-[15px] font-bold text-foreground leading-snug">{entry.title}</h3>
          <p className="text-xs text-foreground-subtle mt-0.5 font-medium">{entry.authority}</p>
        </div>
      </div>

      {/* description */}
      <p className="text-[13px] text-foreground-muted leading-relaxed line-clamp-2">{entry.description}</p>

      {/* stats */}
      {/* <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2">
          <Users size={13} className="text-foreground-subtle flex-shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-foreground tabular-nums leading-tight">
              {entry.stats.totalSeats.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-foreground-subtle leading-tight">Total seats</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2">
          <Building2 size={13} className="text-foreground-subtle flex-shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-foreground tabular-nums leading-tight">
              {entry.stats.participatingColleges}
            </p>
            <p className="text-[10px] text-foreground-subtle leading-tight">Colleges</p>
          </div>
        </div>
      </div> */}

      {/* registration */}
      <div className="flex items-center gap-1.5 text-[12px] text-foreground-muted">
        <Calendar size={12} className="flex-shrink-0 text-foreground-subtle" />
        <span>Registration:</span>
        <span className="font-semibold text-foreground">
          {entry.registrationDates.start} — {entry.registrationDates.end}
        </span>
      </div>

      {/* quotas */}
      <div className="flex flex-wrap gap-1.5">
        {entry.quotas.slice(0, 3).map(q => (
          <span key={q} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted border border-border text-foreground-subtle">
            {q}
          </span>
        ))}
        {entry.quotas.length > 3 && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted border border-border text-foreground-subtle">
            +{entry.quotas.length - 3} more
          </span>
        )}
      </div>

      {/* footer CTA */}
      <div className="pt-2 border-t border-border mt-auto">
        <Link
          href={`/dashboard/counselling/${entry.id}`}
          className="flex items-center justify-between w-full group/link"
        >
          <span className="text-[13px] font-semibold text-primary group-hover/link:underline">
            View details
          </span>
          <span className="w-6 h-6 rounded-full bg-primary/8 flex items-center justify-center
            group-hover/link:bg-primary/15 transition-colors">
            <ChevronRight size={12} className="text-primary" />
          </span>
        </Link>
      </div>
    </div>
  );
}

// ─── Status filter pills ──────────────────────────────────────────────────────

const STATUS_PILLS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Closed', value: 'closed' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CounsellingPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  const filtered = useMemo(() => DATA.filter(e => {
    if (type && e.type !== type) return false;
    if (status && e.status !== status) return false;
    if (query && !e.title.toLowerCase().includes(query.toLowerCase()) &&
      !e.authority.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [query, type, status]);

  const hasFilters = !!(query || type || status);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">

        {/* ── Page Header ── */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Counselling 2025</h1>
          <p className="text-sm text-foreground-muted mt-2 max-w-md mx-auto leading-relaxed">
            Browse all NEET counselling authorities — MCC, state quota, AIIMS, JIPMER, and deemed universities.
          </p>
        </div>

        {/* ── Centered Filter Bar ── */}
        <div className="max-w-2xl mx-auto mb-8 space-y-3">

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or authority…"
              className="w-full h-11 pl-10 pr-4 border border-border rounded-2xl bg-surface text-sm
                text-foreground placeholder:text-foreground-subtle outline-none
                focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2 justify-center flex-wrap">
            {/* <div className="flex items-center gap-1.5 text-xs text-foreground-subtle font-medium">
              <SlidersHorizontal size={12} />
              Filter:
            </div> */}

            <FSelect value={type} onChange={setType}>
              <option value="">All types</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </FSelect>

            {/* Status pills */}
            <div className="flex items-center gap-1 bg-muted rounded-xl p-0.5 border border-border">
              {STATUS_PILLS.map(pill => (
                <button
                  key={pill.value}
                  onClick={() => setStatus(pill.value)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                    status === pill.value
                      ? 'bg-surface shadow-sm text-foreground border border-border'
                      : 'text-foreground-muted hover:text-foreground'
                  )}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Result count ── */}
        <div className="flex items-center justify-between mb-4 px-0.5">
          <p className="text-sm text-foreground-subtle">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'result' : 'results'}
          </p>
          {hasFilters && (
            <p className="text-xs text-foreground-subtle">
              Filtered from {DATA.length} total
            </p>
          )}
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Users size={22} className="text-foreground-subtle" />
            </div>
            <p className="text-base font-bold text-foreground mb-1">No results found</p>
            <p className="text-sm text-foreground-muted">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setQuery(''); setType(''); setStatus(''); }}
              className="mt-4 px-4 py-2 text-sm font-medium bg-muted rounded-xl border border-border
                hover:bg-muted/80 transition-colors text-foreground-muted"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(e => <CounsellingCard key={e.id} entry={e} />)}
          </div>
        )}

      </div>
    </div>
  );
}