'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  ArrowRight, BookmarkIcon, GraduationCap, MapPin, Search,
  SlidersHorizontal, Bed, IndianRupee, Trophy, ChevronRight,
  Building2, Sparkles, X, RotateCcw, Filter, TrendingUp,
  Calendar, Award, ShieldCheck, Hash
} from 'lucide-react';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ────────────────────────────────────────────────────────────────────────────
// TYPES & DATA
// ────────────────────────────────────────────────────────────────────────────

type Bucket = 'safe' | 'target' | 'dream';
type Round = 'r1' | 'r2' | 'r3';
type Year = 2023 | 2024 | 2025;

interface CutoffMatrix {
  [year: number]: { [round: string]: number };
}

interface College {
  id: number;
  name: string;
  shortName: string;
  state: string;
  city: string;
  type: 'Government' | 'Private' | 'Deemed' | 'AIIMS';
  fees: number;
  beds: number;
  established: number;
  bond: boolean;
  hostel: boolean;
  course: string;
  cutoffs: CutoffMatrix;
  image: string;
  logoColor: string;
  tags: string[];
}

const STATES = [
  'All States', 'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi NCR',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Puducherry', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const CATEGORIES = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'];
const COURSES = ['MBBS', 'BDS', 'BAMS', 'BHMS', 'BUMS', 'BVSc'];
const INSTITUTE_TYPES = ['All Types', 'Government', 'Private', 'Deemed', 'AIIMS'];

const COLLEGES: College[] = [
  {
    id: 1, name: 'All India Institute of Medical Sciences, New Delhi', shortName: 'AIIMS Delhi',
    state: 'Delhi NCR', city: 'New Delhi', type: 'AIIMS', fees: 1628, beds: 2478,
    established: 1956, bond: false, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 47, r2: 52, r3: 67 }, 2024: { r1: 42, r2: 49, r3: 58 }, 2025: { r1: 38, r2: 45, r3: 51 } },
    image: 'linear-gradient(135deg, #0d9488 0%, #042f2e 100%)',
    logoColor: '#0d9488',
    tags: ['AIIMS', 'AIQ', 'Top Tier'],
  },
  {
    id: 2, name: 'Jawaharlal Institute of Postgraduate Medical Education', shortName: 'JIPMER',
    state: 'Puducherry', city: 'Puducherry', type: 'Government', fees: 0, beds: 2150,
    established: 1823, bond: false, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 102, r2: 145, r3: 198 }, 2024: { r1: 89, r2: 124, r3: 167 }, 2025: { r1: 78, r2: 105, r3: 142 } },
    image: 'linear-gradient(135deg, #7c3aed 0%, #2e1065 100%)',
    logoColor: '#7c3aed',
    tags: ['JIPMER', 'AIQ'],
  },
  {
    id: 3, name: 'Maulana Azad Medical College', shortName: 'MAMC',
    state: 'Delhi NCR', city: 'New Delhi', type: 'Government', fees: 3200, beds: 2800,
    established: 1958, bond: true, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 245, r2: 312, r3: 398 }, 2024: { r1: 198, r2: 267, r3: 342 }, 2025: { r1: 175, r2: 230, r3: 295 } },
    image: 'linear-gradient(135deg, #0ea5e9 0%, #0c4a6e 100%)',
    logoColor: '#0ea5e9',
    tags: ['Government', 'AIQ'],
  },
  {
    id: 4, name: 'Vardhman Mahavir Medical College & Safdarjung Hospital', shortName: 'VMMC',
    state: 'Delhi NCR', city: 'New Delhi', type: 'Government', fees: 5000, beds: 1531,
    established: 2001, bond: true, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 542, r2: 689, r3: 845 }, 2024: { r1: 478, r2: 612, r3: 756 }, 2025: { r1: 412, r2: 534, r3: 678 } },
    image: 'linear-gradient(135deg, #16a34a 0%, #14532d 100%)',
    logoColor: '#16a34a',
    tags: ['Government', 'AIQ'],
  },
  {
    id: 5, name: 'Grant Government Medical College', shortName: 'Grant Medical',
    state: 'Maharashtra', city: 'Mumbai', type: 'Government', fees: 15000, beds: 1380,
    established: 1845, bond: true, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 1245, r2: 1567, r3: 1892 }, 2024: { r1: 1089, r2: 1342, r3: 1645 }, 2025: { r1: 945, r2: 1198, r3: 1456 } },
    image: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)',
    logoColor: '#d97706',
    tags: ['Government', 'AIQ', 'Heritage'],
  },
  {
    id: 6, name: 'Madras Medical College', shortName: 'MMC Chennai',
    state: 'Tamil Nadu', city: 'Chennai', type: 'Government', fees: 5000, beds: 2718,
    established: 1835, bond: true, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 1847, r2: 2234, r3: 2645 }, 2024: { r1: 1623, r2: 1956, r3: 2342 }, 2025: { r1: 1456, r2: 1789, r3: 2145 } },
    image: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
    logoColor: '#dc2626',
    tags: ['Government', 'AIQ', 'Heritage'],
  },
  {
    id: 7, name: 'AIIMS Jodhpur', shortName: 'AIIMS Jodhpur',
    state: 'Rajasthan', city: 'Jodhpur', type: 'AIIMS', fees: 1628, beds: 960,
    established: 2012, bond: false, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 2345, r2: 2890, r3: 3456 }, 2024: { r1: 2098, r2: 2567, r3: 3098 }, 2025: { r1: 1845, r2: 2289, r3: 2756 } },
    image: 'linear-gradient(135deg, #2563eb 0%, #1e3a5f 100%)',
    logoColor: '#2563eb',
    tags: ['AIIMS', 'AIQ'],
  },
  {
    id: 8, name: 'Byramjee Jeejeebhoy Medical College', shortName: 'B.J. Medical',
    state: 'Gujarat', city: 'Ahmedabad', type: 'Government', fees: 12000, beds: 2200,
    established: 1946, bond: true, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 3245, r2: 3890, r3: 4567 }, 2024: { r1: 2876, r2: 3456, r3: 4123 }, 2025: { r1: 2534, r2: 3098, r3: 3712 } },
    image: 'linear-gradient(135deg, #7c3aed 0%, #2e1065 100%)',
    logoColor: '#7c3aed',
    tags: ['Government', 'AIQ'],
  },
  {
    id: 9, name: 'King George Medical University', shortName: 'KGMU Lucknow',
    state: 'Uttar Pradesh', city: 'Lucknow', type: 'Government', fees: 18000, beds: 4500,
    established: 1905, bond: true, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 4567, r2: 5234, r3: 6098 }, 2024: { r1: 4123, r2: 4789, r3: 5567 }, 2025: { r1: 3678, r2: 4234, r3: 4945 } },
    image: 'linear-gradient(135deg, #0d9488 0%, #042f2e 100%)',
    logoColor: '#0d9488',
    tags: ['Government', 'AIQ', 'Heritage'],
  },
  {
    id: 10, name: 'Kasturba Medical College', shortName: 'KMC Manipal',
    state: 'Karnataka', city: 'Manipal', type: 'Deemed', fees: 1450000, beds: 2032,
    established: 1953, bond: false, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 12450, r2: 15670, r3: 18900 }, 2024: { r1: 11200, r2: 14300, r3: 17200 }, 2025: { r1: 10100, r2: 12800, r3: 15600 } },
    image: 'linear-gradient(135deg, #0ea5e9 0%, #0c4a6e 100%)',
    logoColor: '#0ea5e9',
    tags: ['Private', 'Deemed'],
  },
  {
    id: 11, name: 'Christian Medical College', shortName: 'CMC Vellore',
    state: 'Tamil Nadu', city: 'Vellore', type: 'Private', fees: 48000, beds: 2725,
    established: 1900, bond: true, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 1567, r2: 1890, r3: 2234 }, 2024: { r1: 1389, r2: 1678, r3: 2012 }, 2025: { r1: 1234, r2: 1490, r3: 1789 } },
    image: 'linear-gradient(135deg, #16a34a 0%, #14532d 100%)',
    logoColor: '#16a34a',
    tags: ['Private', 'Heritage', 'Top Tier'],
  },
  {
    id: 12, name: 'Sri Ramachandra Institute', shortName: 'SRIHER',
    state: 'Tamil Nadu', city: 'Chennai', type: 'Deemed', fees: 1250000, beds: 1685,
    established: 1985, bond: false, hostel: true, course: 'MBBS',
    cutoffs: { 2023: { r1: 18900, r2: 22300, r3: 26700 }, 2024: { r1: 17200, r2: 20100, r3: 24300 }, 2025: { r1: 15600, r2: 18400, r3: 22100 } },
    image: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)',
    logoColor: '#d97706',
    tags: ['Private', 'Deemed'],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────

function getRankBucket(userRank: number, cutoff: number): Bucket | null {
  const r = userRank / cutoff;
  if (r <= 0.80) return 'safe';
  if (r <= 1.15) return 'target';
  if (r <= 1.50) return 'dream';
  return null;
}

function formatFees(n: number) {
  if (n === 0) return 'Free';
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function formatRank(n: number) {
  return n.toLocaleString('en-IN');
}

function marksToRank(marks: number): number {
  // Rough approximation for demo
  if (marks >= 715) return Math.round((720 - marks) * 50 + 1);
  if (marks >= 650) return Math.round((720 - marks) * 600);
  if (marks >= 550) return Math.round((720 - marks) * 1200);
  if (marks >= 450) return Math.round((720 - marks) * 1500);
  return Math.round((720 - marks) * 2000);
}

// ────────────────────────────────────────────────────────────────────────────
// STYLE TOKENS
// ────────────────────────────────────────────────────────────────────────────

const BUCKET_BADGE: Record<Bucket, string> = {
  safe: 'bg-success-light text-success ring-1 ring-success/20',
  target: 'bg-warning-light text-warning ring-1 ring-warning/20',
  dream: 'bg-secondary-light text-secondary ring-1 ring-secondary/20',
};

const BUCKET_DOT: Record<Bucket, string> = {
  safe: 'bg-success',
  target: 'bg-warning',
  dream: 'bg-secondary',
};

const BUCKET_LABEL: Record<Bucket, string> = {
  safe: 'Safe',
  target: 'Target',
  dream: 'Dream',
};

// ────────────────────────────────────────────────────────────────────────────
// SKELETON
// ────────────────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-[200px] h-[140px] md:h-auto bg-skeleton flex-shrink-0" />
        <div className="flex-1 p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-skeleton rounded-md w-3/4" />
              <div className="h-3 bg-skeleton rounded-md w-1/2" />
            </div>
            <div className="h-6 w-16 bg-skeleton rounded-full" />
          </div>
          <div className="grid grid-cols-4 gap-3 pt-2">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="space-y-1.5">
                <div className="h-2.5 bg-skeleton rounded w-12" />
                <div className="h-3.5 bg-skeleton rounded w-16" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-10 bg-skeleton rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// COLLEGE CARD
// ────────────────────────────────────────────────────────────────────────────

interface CollegeCardProps {
  college: College & { bucket: Bucket };
  saved: boolean;
  onSave: () => void;
  selectedYear: Year;
}

function CollegeCard({ college, saved, onSave, selectedYear }: CollegeCardProps) {
  const [activeRound, setActiveRound] = useState<Round>('r1');
  const cutoff = college.cutoffs[selectedYear][activeRound];
  const initials = college.shortName.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();

  return (
    <article
      className={cn(
        'group relative bg-card border border-border rounded-2xl overflow-hidden',
        'transition-all duration-300 hover:shadow-lg hover:border-border-strong',
        'hover:-translate-y-0.5'
      )}
    >
      <div className="flex flex-col md:flex-row">
        {/* IMAGE / LOGO BLOCK */}
        <div
          className="relative w-full md:w-[200px] h-[160px] md:h-auto flex-shrink-0 overflow-hidden"
          style={{ background: college.image }}
        >
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, white 1px, transparent 1px),
                                radial-gradient(circle at 80% 70%, white 1px, transparent 1px)`,
              backgroundSize: '24px 24px, 32px 32px',
            }}
          />

          {/* Bucket badge — top right */}
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                'flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full',
                'bg-white/95 backdrop-blur-sm shadow-sm'
              )}
              style={{ color: college.logoColor }}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', BUCKET_DOT[college.bucket])} />
              {BUCKET_LABEL[college.bucket]}
            </span>
          </div>

          {/* Logo & name overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 flex items-end gap-3">
            <div
              className={cn(
                'w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center',
                'flex-shrink-0 font-bold text-sm tracking-tight'
              )}
              style={{ color: college.logoColor }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0 pb-0.5">
              <p className="text-sm font-bold text-white drop-shadow-md leading-tight">
                {college.shortName}
              </p>
              <p className="text-xs text-white/85 drop-shadow-sm mt-0.5">
                Est. {college.established}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-foreground leading-tight line-clamp-1">
                {college.name}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-foreground-muted">
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-foreground-subtle" />
                  {college.city}, {college.state}
                </span>
                <span className="text-foreground-subtle">·</span>
                <span className="flex items-center gap-1">
                  <Building2 size={11} className="text-foreground-subtle" />
                  {college.type}
                </span>
              </div>
            </div>

            <button
              onClick={onSave}
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0',
                saved
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-foreground-subtle hover:text-primary hover:bg-primary-light'
              )}
              aria-label="Save college"
            >
              <BookmarkIcon size={15} fill={saved ? 'currentColor' : 'none'} strokeWidth={2.2} />
            </button>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Metric icon={IndianRupee} label="Fees / yr" value={formatFees(college.fees)} />
            <Metric icon={Bed} label="Beds" value={college.beds.toLocaleString('en-IN')} />
            <Metric
              icon={Trophy}
              label="Closing rank"
              value={formatRank(cutoff)}
              accent
            />
            <Metric
              icon={college.bond ? ShieldCheck : Award}
              label={college.bond ? 'Bond' : 'No bond'}
              value={college.bond ? 'Required' : 'Free'}
            />
          </div>

          {/* Year & Round Pills */}
          <div className="border-t border-border pt-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-foreground-subtle">
                Cutoff trends · All India Quota
              </p>
            </div>

            {/* Round selector */}
            <div className="flex gap-1.5 mb-3">
              {(['r1', 'r2', 'r3'] as Round[]).map(round => (
                <button
                  key={round}
                  onClick={() => setActiveRound(round)}
                  className={cn(
                    'flex-1 py-1.5 px-2.5 rounded-md text-xs font-semibold transition-all',
                    activeRound === round
                      ? 'bg-foreground text-foreground-inverse'
                      : 'bg-muted text-foreground-muted hover:bg-hover'
                  )}
                >
                  {round.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Year cutoff trend */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {([2023, 2024, 2025] as Year[]).map((yr, idx) => {
                const val = college.cutoffs[yr][activeRound];
                const isLatest = yr === 2025;
                const prev = idx > 0 ? college.cutoffs[([2023, 2024, 2025] as Year[])[idx - 1]][activeRound] : null;
                const trend = prev ? ((val - prev) / prev) * 100 : 0;

                return (
                  <div
                    key={yr}
                    className={cn(
                      'rounded-lg px-2.5 py-2 border',
                      isLatest
                        ? 'border-primary/30 bg-primary-light/40'
                        : 'border-border bg-muted/40'
                    )}
                  >
                    <p className="text-[10px] font-semibold text-foreground-subtle">{yr}</p>
                    <p className="text-sm font-bold text-foreground tabular-nums leading-tight mt-0.5">
                      {formatRank(val)}
                    </p>
                    {prev && (
                      <p className={cn(
                        'text-[10px] font-medium mt-0.5 tabular-nums',
                        trend < 0 ? 'text-success' : 'text-error'
                      )}>
                        {trend < 0 ? '↓' : '↑'} {Math.abs(trend).toFixed(1)}%
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <button className={cn(
              'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg',
              'bg-foreground text-foreground-inverse text-xs font-semibold',
              'hover:bg-foreground/90 transition-all group/btn'
            )}>
              View full details
              <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-0.5">
        <Icon size={10} className="text-foreground-subtle" />
        <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground-subtle">
          {label}
        </p>
      </div>
      <p className={cn(
        'text-sm font-bold tabular-nums leading-none',
        accent ? 'text-primary' : 'text-foreground'
      )}>
        {value}
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// FILTER PANEL (LEFT)
// ────────────────────────────────────────────────────────────────────────────

interface FilterState {
  marks: string;
  rank: string;
  category: string;
  state: string;
  city: string;
  course: string;
  instituteType: string;
  hostel: boolean;
  feeMax: number;
  noBond: boolean;
  year: Year;
}

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onPredict: () => void;
  onReset: () => void;
  errors: { rank?: string; marks?: string };
}

function FilterPanel({ filters, setFilters, onPredict, onReset, errors }: FilterPanelProps) {
  const [inputMode, setInputMode] = useState<'marks' | 'rank'>('marks');

  return (
    <aside className="bg-card border border-border rounded-2xl overflow-hidden
                      h-full flex flex-col min-h-0">
      {/* Header — fixed */}
      <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <SlidersHorizontal size={14} strokeWidth={2.4} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Refine search</h2>
            <p className="text-[10px] text-foreground-muted">Tell us about your candidacy</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] font-semibold text-foreground-muted hover:text-foreground
                     flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={11} />
          Reset
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5
                      scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {/* SECTION 1: SCORE INPUT */}
        <section>
          <SectionLabel num="01" title="Your score" />

          {/* Toggle between marks/rank */}
          <div className="bg-muted rounded-lg p-1 grid grid-cols-2 gap-1 mb-3">
            <button
              onClick={() => setInputMode('marks')}
              className={cn(
                'py-1.5 text-xs font-semibold rounded-md transition-all',
                inputMode === 'marks'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              )}
            >
              Marks
            </button>
            <button
              onClick={() => setInputMode('rank')}
              className={cn(
                'py-1.5 text-xs font-semibold rounded-md transition-all',
                inputMode === 'rank'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              )}
            >
              Rank
            </button>
          </div>

          {inputMode === 'marks' ? (
            <div>
              <FieldLabel>Enter your marks <span className="text-foreground-subtle font-normal">(out of 720)</span></FieldLabel>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={720}
                  value={filters.marks}
                  onChange={e => setFilters(f => ({ ...f, marks: e.target.value, rank: '' }))}
                  placeholder="e.g. 645"
                  className={cn(
                    'w-full h-10 pl-3 pr-14 rounded-lg bg-input text-sm font-medium text-foreground',
                    'placeholder:text-foreground-subtle focus:outline-none transition-colors',
                    errors.marks
                      ? 'border-2 border-error'
                      : 'border border-border focus:border-primary'
                  )}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-foreground-subtle">
                  / 720
                </span>
              </div>
              {errors.marks && <ErrorText>{errors.marks}</ErrorText>}
            </div>
          ) : (
            <div>
              <FieldLabel>Enter your rank</FieldLabel>
              <input
                type="number"
                min={1}
                value={filters.rank}
                onChange={e => setFilters(f => ({ ...f, rank: e.target.value, marks: '' }))}
                placeholder="e.g. 45,000"
                className={cn(
                  'w-full h-10 px-3 rounded-lg bg-input text-sm font-medium text-foreground',
                  'placeholder:text-foreground-subtle focus:outline-none transition-colors',
                  errors.rank
                    ? 'border-2 border-error'
                    : 'border border-border focus:border-primary'
                )}
              />
              {errors.rank && <ErrorText>{errors.rank}</ErrorText>}
            </div>
          )}

          <div className="mt-3">
            <FieldLabel>Reservation category</FieldLabel>
            <SelectField
              value={filters.category}
              onChange={v => setFilters(f => ({ ...f, category: v }))}
              options={CATEGORIES}
            />
          </div>
        </section>

        <Divider />

        {/* SECTION 2: PREFERENCES */}
        <section>
          <SectionLabel num="02" title="Preferences" />

          <div className="space-y-3">
            <div>
              <FieldLabel>Course</FieldLabel>
              <SelectField
                value={filters.course}
                onChange={v => setFilters(f => ({ ...f, course: v }))}
                options={COURSES}
              />
            </div>

            <div>
              <FieldLabel>State</FieldLabel>
              <SelectField
                value={filters.state}
                onChange={v => setFilters(f => ({ ...f, state: v }))}
                options={STATES}
              />
            </div>

            <div>
              <FieldLabel>City <span className="text-foreground-subtle font-normal">(optional)</span></FieldLabel>
              <input
                type="text"
                value={filters.city}
                onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
                placeholder="Any city"
                className="w-full h-10 px-3 rounded-lg bg-input border border-border
                  text-sm font-medium text-foreground placeholder:text-foreground-subtle
                  focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <FieldLabel>Institute type</FieldLabel>
              <SelectField
                value={filters.instituteType}
                onChange={v => setFilters(f => ({ ...f, instituteType: v }))}
                options={INSTITUTE_TYPES}
              />
            </div>
          </div>
        </section>

        <Divider />

        {/* SECTION 3: ADDITIONAL */}
        <section>
          <SectionLabel num="03" title="Additional" />

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel className="mb-0">Max annual fees</FieldLabel>
                <span className="text-xs font-bold text-primary tabular-nums">
                  {filters.feeMax >= 1500000 ? 'Any' : formatFees(filters.feeMax)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1500000}
                step={50000}
                value={filters.feeMax}
                onChange={e => setFilters(f => ({ ...f, feeMax: Number(e.target.value) }))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-foreground-subtle font-medium mt-0.5">
                <span>Free</span>
                <span>15L+</span>
              </div>
            </div>

            <div>
              <FieldLabel>Cutoff year</FieldLabel>
              <div className="grid grid-cols-3 gap-1.5">
                {([2023, 2024, 2025] as Year[]).map(yr => (
                  <button
                    key={yr}
                    onClick={() => setFilters(f => ({ ...f, year: yr }))}
                    className={cn(
                      'py-2 rounded-lg text-xs font-bold transition-all',
                      filters.year === yr
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-foreground-muted hover:bg-hover'
                    )}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            <ToggleRow
              label="Hostel available"
              checked={filters.hostel}
              onChange={v => setFilters(f => ({ ...f, hostel: v }))}
            />
            <ToggleRow
              label="No bond obligation"
              checked={filters.noBond}
              onChange={v => setFilters(f => ({ ...f, noBond: v }))}
            />
          </div>
        </section>
      </div>

      {/* Action button — fixed at bottom */}
      <div className="p-4 border-t border-border bg-muted/30 flex-shrink-0">
        <button
          onClick={onPredict}
          className={cn(
            'w-full flex items-center justify-center gap-2 h-11 rounded-lg',
            'bg-primary text-primary-foreground text-sm font-bold',
            'hover:bg-primary-hover transition-all shadow-sm hover:shadow-md',
            'group'
          )}
        >
          <Sparkles size={15} />
          Predict colleges
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </aside>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ────────────────────────────────────────────────────────────────────────────

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[10px] font-bold tabular-nums text-foreground-subtle font-mono">
        {num}
      </span>
      <span className="h-px flex-1 bg-border" />
      <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
        {title}
      </span>
    </div>
  );
}

function FieldLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('block text-xs font-semibold text-foreground-muted mb-1.5', className)}>
      {children}
    </label>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-[11px] font-semibold text-error flex items-center gap-1">
      <span className="w-1 h-1 rounded-full bg-error" />
      {children}
    </p>
  );
}

function SelectField({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-10 pl-3 pr-9 rounded-lg bg-input border border-border
          text-sm font-medium text-foreground focus:outline-none focus:border-primary
          transition-colors appearance-none cursor-pointer"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronRight
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-foreground-subtle pointer-events-none"
      />
    </div>
  );
}

function ToggleRow({
  label, checked, onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between py-2 group"
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span
        className={cn(
          'relative w-9 h-5 rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-border'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm',
            'transition-transform',
            checked && 'translate-x-4'
          )}
        />
      </span>
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}

// ────────────────────────────────────────────────────────────────────────────
// EMPTY / WELCOME STATE
// ────────────────────────────────────────────────────────────────────────────

function WelcomeState() {
  return (
    <div className="bg-card border border-border rounded-2xl p-10 lg:p-14 text-center">
      <div className="relative inline-block mb-5">
        <div className="absolute inset-0 bg-primary/15 blur-2xl rounded-full" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover
          flex items-center justify-center shadow-lg">
          <GraduationCap size={28} className="text-primary-foreground" strokeWidth={2.2} />
        </div>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">
        Find your medical college
      </h2>
      <p className="text-sm text-foreground-muted max-w-sm mx-auto leading-relaxed">
        Enter your NEET marks or rank to see personalized college predictions
        across <span className="font-semibold text-foreground">12+ institutes</span> with
        cutoff trends from 2023–2025.
      </p>

      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto mt-8">
        {[
          { val: '500+', lbl: 'Colleges' },
          { val: '3 yrs', lbl: 'Cutoff data' },
          { val: 'AIQ', lbl: 'All India Quota' },
        ].map(s => (
          <div key={s.lbl} className="bg-muted rounded-xl p-3">
            <p className="text-base font-bold text-foreground tabular-nums">{s.val}</p>
            <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wide mt-0.5">
              {s.lbl}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SUMMARY STRIP
// ────────────────────────────────────────────────────────────────────────────

function SummaryStrip({
  total, safe, target, dream, savedCount,
}: {
  total: number; safe: number; target: number; dream: number; savedCount: number;
}) {
  const stats = [
    { label: 'Total matches', value: total, dot: 'bg-foreground' },
    { label: 'Safe', value: safe, dot: 'bg-success' },
    { label: 'Target', value: target, dot: 'bg-warning' },
    { label: 'Dream', value: dream, dot: 'bg-secondary' },
    { label: 'Shortlisted', value: savedCount, dot: 'bg-primary' },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl px-5 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {stats.map(s => (
          <div key={s.label} className="flex items-center gap-2.5">
            <span className={cn('w-2 h-2 rounded-full', s.dot)} />
            <div>
              <p className="text-[10px] font-semibold tracking-wide uppercase text-foreground-muted">
                {s.label}
              </p>
              <p className="text-lg font-bold text-foreground tabular-nums leading-tight">
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────────────────

export default function PredictorPage() {
  const [filters, setFilters] = useState<FilterState>({
    marks: '',
    rank: '',
    category: 'General',
    state: 'All States',
    city: '',
    course: 'MBBS',
    instituteType: 'All Types',
    hostel: false,
    feeMax: 1500000,
    noBond: false,
    year: 2025,
  });

  const [predicted, setPredicted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ rank?: string; marks?: string }>({});
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<'cutoff' | 'fees' | 'name'>('cutoff');

  const toggleSave = (id: number) =>
    setSaved(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const handlePredict = () => {
    const newErrors: typeof errors = {};
    if (!filters.marks && !filters.rank) {
      newErrors.marks = 'Field is required';
      newErrors.rank = 'Field is required';
    }
    if (filters.marks && (Number(filters.marks) < 0 || Number(filters.marks) > 720)) {
      newErrors.marks = 'Marks must be between 0 and 720';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setPredicted(true);
    setTimeout(() => setLoading(false), 1100);
  };

  const handleReset = () => {
    setFilters({
      marks: '', rank: '', category: 'General', state: 'All States',
      city: '', course: 'MBBS', instituteType: 'All Types',
      hostel: false, feeMax: 1500000, noBond: false, year: 2025,
    });
    setPredicted(false);
    setErrors({});
  };

  const userRank = useMemo(() => {
    if (filters.rank) return parseInt(filters.rank);
    if (filters.marks) return marksToRank(parseInt(filters.marks));
    return 0;
  }, [filters.rank, filters.marks]);

  const results = useMemo(() => {
    if (!predicted || !userRank) return [];
    return COLLEGES
      .filter(c => {
        if (filters.state !== 'All States' && c.state !== filters.state) return false;
        if (filters.city && !c.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
        if (filters.instituteType !== 'All Types' && c.type !== filters.instituteType) return false;
        if (filters.noBond && c.bond) return false;
        if (filters.hostel && !c.hostel) return false;
        if (c.fees > filters.feeMax) return false;
        return true;
      })
      .map(c => ({
        ...c,
        bucket: getRankBucket(userRank, c.cutoffs[filters.year].r1),
      }))
      .filter((c): c is College & { bucket: Bucket } => c.bucket !== null)
      .sort((a, b) => {
        if (sortBy === 'cutoff') return a.cutoffs[filters.year].r1 - b.cutoffs[filters.year].r1;
        if (sortBy === 'fees') return a.fees - b.fees;
        return a.name.localeCompare(b.name);
      });
  }, [predicted, userRank, filters, sortBy]);

  const safeCount = results.filter(r => r.bucket === 'safe').length;
  const targetCount = results.filter(r => r.bucket === 'target').length;
  const dreamCount = results.filter(r => r.bucket === 'dream').length;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* HERO */}
      {/* <header className="border-b border-border bg-card/40 backdrop-blur-sm flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-10 max-w-[1500px] mx-auto py-6">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-foreground-muted mb-2">
            <span className="w-6 h-px bg-foreground-muted" />
            NEET UG · 2026 Counselling
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                College <span className="text-primary">Predictor</span>
              </h1>
              <p className="text-sm text-foreground-muted mt-1 max-w-2xl">
                Personalized college matches with three-year cutoff trends across all rounds.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground-muted">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-light text-success font-semibold ring-1 ring-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Live cutoff data
              </span>
            </div>
          </div>
        </div>
      </header> */}

      {/* MAIN GRID — fills remaining viewport, no page scroll */}
      <main className="flex-1 min-h-0 px-4 sm:px-6 lg:px-10 max-w-[1500px] w-full mx-auto py-5 pt-22">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 h-full min-h-0">
          {/* LEFT: FILTERS — fixed, fills column height */}
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onPredict={handlePredict}
            onReset={handleReset}
            errors={errors}
          />

          {/* RIGHT: RESULTS — only this scrolls */}
          <section className="min-w-0 h-full overflow-y-auto pr-1 -mr-1
                              scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            <div className="space-y-4 pb-2">
            {!predicted && <WelcomeState />}

            {predicted && loading && (
              <>
                <div className="bg-card border border-border rounded-2xl px-5 py-4 animate-pulse">
                  <div className="grid grid-cols-5 gap-4">
                    {[0, 1, 2, 3, 4].map(i => (
                      <div key={i} className="space-y-1.5">
                        <div className="h-2.5 bg-skeleton rounded w-16" />
                        <div className="h-5 bg-skeleton rounded w-10" />
                      </div>
                    ))}
                  </div>
                </div>
                {[0, 1, 2, 3].map(i => <CardSkeleton key={i} />)}
              </>
            )}

            {predicted && !loading && results.length > 0 && (
              <>
                <SummaryStrip
                  total={results.length}
                  safe={safeCount}
                  target={targetCount}
                  dream={dreamCount}
                  savedCount={saved.size}
                />

                {/* Sort bar */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    Showing <span className="text-primary">{results.length}</span> matched colleges
                    <span className="text-foreground-muted font-normal">
                      {' '}for rank <span className="font-bold tabular-nums text-foreground">{formatRank(userRank)}</span>
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground-muted">Sort by:</span>
                    <div className="flex gap-1 bg-muted rounded-lg p-1">
                      {(['cutoff', 'fees', 'name'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setSortBy(s)}
                          className={cn(
                            'px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all',
                            sortBy === s
                              ? 'bg-card text-foreground shadow-sm'
                              : 'text-foreground-muted hover:text-foreground'
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-4">
                  {results.map(c => (
                    <CollegeCard
                      key={c.id}
                      college={c}
                      saved={saved.has(c.id)}
                      onSave={() => toggleSave(c.id)}
                      selectedYear={filters.year}
                    />
                  ))}
                </div>
              </>
            )}

            {predicted && !loading && results.length === 0 && (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search size={22} className="text-foreground-subtle" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">No colleges found</h3>
                <p className="text-sm text-foreground-muted max-w-sm mx-auto">
                  Try widening your filters — increase max fees, change state, or remove the bond restriction.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <RotateCcw size={12} /> Reset all filters
                </button>
              </div>
            )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}