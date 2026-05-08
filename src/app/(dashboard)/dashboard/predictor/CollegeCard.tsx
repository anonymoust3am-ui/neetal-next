'use client';
import {
  BookmarkIcon, MapPin, ChevronRight,
  ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Bucket = 'safe' | 'target' | 'dream';
type Round = 'r1' | 'r2' | 'r3';
type Year = 2023 | 2024 | 2025;

interface CutoffMatrix { [year: number]: { [round: string]: number }; }

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

function formatFees(n: number) {
  if (n === 0) return 'Free';
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function formatRank(n: number) {
  return n.toLocaleString('en-IN');
}

interface CollegeCardProps {
  college: College & { bucket: Bucket };
  saved: boolean;
  onSave: () => void;
  selectedYear: Year;
}

const ROUNDS: Round[] = ['r1', 'r2', 'r3'];

export function CollegeCard({ college, saved, onSave, selectedYear }: CollegeCardProps) {
  const initials = college.shortName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  /* R1/R2/R3 cutoffs for the selected year */
  const roundData = ROUNDS.map((r, i) => {
    const val  = college.cutoffs[selectedYear]?.[r] ?? 0;
    const prev = i > 0 ? (college.cutoffs[selectedYear]?.[ROUNDS[i - 1]] ?? 0) : null;
    const change = prev ? ((val - prev) / prev) * 100 : 0;
    return { round: r, value: val, change, hasPrev: !!prev };
  });

  return (
    <article
      className={cn(
        'group relative bg-card border border-border rounded-xl overflow-hidden',
        'transition-all duration-300 ease-out',
        'hover:border-border-strong hover:shadow-md'
      )}
    >
      <div className="flex">
        {/* ─── COVER — slim vertical band ─── */}
        <div
          className="relative w-32 sm:w-36 flex-shrink-0 overflow-hidden"
          style={{ background: college.image }}
        >
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[5rem] font-bold leading-none text-white/15 tracking-tighter select-none">
              {initials[0]}
            </span>
          </div>

          {/* Type tag */}
          <div className="absolute top-2 left-2">
            <span className="text-xs font-mono font-semibold tracking-widest uppercase
                             text-white/90 bg-black/25 backdrop-blur-sm px-1.5 py-0.5 rounded">
              {college.type}
            </span>
          </div>

          {/* Logo + name */}
          <div className="absolute inset-x-0 bottom-0 p-2">
            <div className="flex items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center
                           font-bold text-xs tracking-tight flex-shrink-0"
                style={{ color: college.logoColor }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white leading-tight truncate"
                   style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                  {college.shortName}
                </p>
                <p className="text-xs text-white/70 mt-px">Est. {college.established}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CONTENT ─── */}
        <div className="flex-1 min-w-0 px-4 py-3 flex flex-col gap-2">

          {/* ROW 1: meta + name + save */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                <span className={cn('w-1.5 h-1.5 rounded-full', BUCKET_DOT[college.bucket])} />
                <span className="text-xs font-bold tracking-wide uppercase text-foreground-muted">
                  {BUCKET_LABEL[college.bucket]} match
                </span>
                <span className="text-foreground-subtle">·</span>
                <span className="flex items-center gap-1 text-xs text-foreground-muted">
                  <MapPin size={10} className="text-foreground-subtle" strokeWidth={2.2} />
                  {college.city}, {college.state}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground leading-snug tracking-tight line-clamp-1">
                {college.name}
              </h3>
            </div>
            <button
              onClick={onSave}
              className={cn(
                'w-7 h-7 rounded-md flex items-center justify-center transition-all flex-shrink-0',
                saved
                  ? 'text-primary bg-primary-light'
                  : 'text-foreground-subtle hover:text-foreground hover:bg-muted'
              )}
              aria-label="Save"
            >
              <BookmarkIcon size={13} fill={saved ? 'currentColor' : 'none'} strokeWidth={2.2} />
            </button>
          </div>

          {/* ROW 2: R1/R2/R3 cutoffs + fees + beds */}
          <div className="flex items-center gap-4">
            {/* R1 / R2 / R3 cutoff trend for selected year */}
            <div className="flex items-baseline gap-3">
              <p className="text-xs font-bold tracking-widest uppercase text-foreground-subtle whitespace-nowrap">
                Cutoff
              </p>
              {roundData.map(({ round, value, change, hasPrev }) => (
                <div key={round} className="min-w-0">
                  <p className="text-xs font-bold text-foreground-subtle uppercase leading-none">
                    {round.toUpperCase()}
                  </p>
                  <div className="flex items-baseline gap-0.5 mt-0.5">
                    <p className="text-sm font-bold tabular-nums text-foreground leading-none">
                      {formatRank(value)}
                    </p>
                    {hasPrev && (
                      <span className={cn(
                        'flex items-center text-xs font-semibold tabular-nums',
                        change < -1 ? 'text-success' : change > 1 ? 'text-error' : 'text-foreground-subtle'
                      )}>
                        {change < -1 ? (
                          <ArrowDownRight size={9} strokeWidth={2.5} />
                        ) : change > 1 ? (
                          <ArrowUpRight size={9} strokeWidth={2.5} />
                        ) : (
                          <Minus size={9} strokeWidth={2.5} />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px self-stretch bg-border" />

            {/* Fees + Beds */}
            <div className="hidden md:flex items-center gap-4">
              <Stat label="Annual fees" value={formatFees(college.fees)} />
              <Stat label="Beds" value={college.beds.toLocaleString('en-IN')} />
            </div>
          </div>

          {/* ROW 3: fees/beds on mobile + CTA */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
            {/* Fees + Beds — mobile only */}
            <div className="flex md:hidden items-center gap-4">
              <Stat label="Annual fees" value={formatFees(college.fees)} />
              <Stat label="Beds" value={college.beds.toLocaleString('en-IN')} />
            </div>
            <div className="hidden md:block" />

            <button className="group/cta flex items-center gap-1 text-xs font-semibold
                               text-foreground hover:text-primary transition-colors whitespace-nowrap">
              View full details
              <ChevronRight size={13} className="transition-transform group-hover/cta:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold tracking-widest uppercase text-foreground-subtle leading-none mb-1">
        {label}
      </p>
      <p className={cn(
        'text-sm font-bold tabular-nums leading-none',
        accent ? 'text-primary' : 'text-foreground'
      )}>
        {value}
      </p>
    </div>
  );
}