'use client';

import { useState } from 'react';
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

export function CollegeCard({ college, saved, onSave, selectedYear }: CollegeCardProps) {
  const [activeRound, setActiveRound] = useState<Round>('r1');
  const cutoff = college.cutoffs[selectedYear][activeRound];
  const initials = college.shortName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const years: Year[] = [2023, 2024, 2025];
  const trends = years.map((yr, i) => {
    const val = college.cutoffs[yr][activeRound];
    const prev = i > 0 ? college.cutoffs[years[i - 1]][activeRound] : null;
    const change = prev ? ((val - prev) / prev) * 100 : 0;
    return { year: yr, value: val, change, hasPrev: !!prev };
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
          className="relative w-[140px] sm:w-[160px] flex-shrink-0 overflow-hidden"
          style={{ background: college.image }}
        >
          {/* Vignette */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />

          {/* Oversized monogram watermark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[5rem] font-bold leading-none text-white/15 tracking-tighter select-none">
              {initials[0]}
            </span>
          </div>

          {/* Type tag — top */}
          <div className="absolute top-2.5 left-2.5">
            <span className="text-[9px] font-mono font-semibold tracking-[0.1em] uppercase
                             text-white/90 bg-black/25 backdrop-blur-sm px-1.5 py-0.5 rounded">
              {college.type}
            </span>
          </div>

          {/* Logo + name — bottom */}
          <div className="absolute inset-x-0 bottom-0 p-2.5">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center
                           font-bold text-[11px] tracking-tight flex-shrink-0"
                style={{ color: college.logoColor }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-white leading-tight truncate"
                   style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                  {college.shortName}
                </p>
                <p className="text-[9px] font-medium text-white/70 mt-px">
                  Since {college.established}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CONTENT — 3 tight rows ─── */}
        <div className="flex-1 min-w-0 p-4 flex flex-col gap-3">
          {/* ROW 1: meta + name + save */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className={cn('w-1.5 h-1.5 rounded-full', BUCKET_DOT[college.bucket])} />
                <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-foreground-muted">
                  {BUCKET_LABEL[college.bucket]} match
                </span>
                <span className="text-foreground-subtle">·</span>
                <span className="flex items-center gap-1 text-[11px] text-foreground-muted">
                  <MapPin size={10} className="text-foreground-subtle" strokeWidth={2.2} />
                  {college.city}, {college.state}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold text-foreground leading-snug tracking-tight line-clamp-1">
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

          {/* ROW 2: stats + cutoff trend — side by side */}
          <div className="flex items-stretch gap-4">
            {/* Stats — left */}
            <div className="flex gap-5">
              <Stat label="Closing rank" value={formatRank(cutoff)} accent />
              <Stat label="Annual fees" value={formatFees(college.fees)} />
              <Stat label="Beds" value={college.beds.toLocaleString('en-IN')} />
            </div>

            {/* Vertical divider */}
            <div className="hidden md:block w-px bg-border" />

            {/* Trend — right (hidden on small screens to keep height down) */}
            <div className="hidden md:flex flex-1 items-center gap-3 min-w-0">
              <p className="text-[9px] font-bold tracking-[0.1em] uppercase text-foreground-subtle whitespace-nowrap leading-tight">
                Cutoff<br />trend
              </p>
              <div className="flex-1 flex items-baseline gap-3 min-w-0">
                {trends.map((t) => (
                  <div key={t.year} className="flex-1 min-w-0">
                    <p className="text-[9px] font-semibold text-foreground-subtle tabular-nums leading-none">
                      {t.year}
                    </p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <p className={cn(
                        'text-[12px] font-bold tabular-nums leading-none',
                        t.year === 2025 ? 'text-foreground' : 'text-foreground-muted'
                      )}>
                        {formatRank(t.value)}
                      </p>
                      {t.hasPrev && (
                        <span className={cn(
                          'flex items-center text-[9px] font-semibold tabular-nums',
                          t.change < -1 ? 'text-success' : t.change > 1 ? 'text-error' : 'text-foreground-subtle'
                        )}>
                          {t.change < -1 ? (
                            <ArrowDownRight size={9} strokeWidth={2.5} />
                          ) : t.change > 1 ? (
                            <ArrowUpRight size={9} strokeWidth={2.5} />
                          ) : (
                            <Minus size={9} strokeWidth={2.5} />
                          )}
                          {Math.abs(t.change).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 3: rounds + CTA — bottom bar */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-border -mb-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-foreground-subtle">
                Round
              </span>
              <div className="flex gap-0.5 bg-muted rounded p-0.5">
                {(['r1', 'r2', 'r3'] as Round[]).map(round => (
                  <button
                    key={round}
                    onClick={() => setActiveRound(round)}
                    className={cn(
                      'px-1.5 py-0.5 rounded-sm text-[10px] font-bold tracking-wide transition-all',
                      activeRound === round
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-foreground-muted hover:text-foreground'
                    )}
                  >
                    {round.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button className="group/cta flex items-center gap-1 text-[12px] font-semibold
                               text-foreground hover:text-primary transition-colors">
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
      <p className="text-[9px] font-bold tracking-[0.1em] uppercase text-foreground-subtle leading-none mb-1">
        {label}
      </p>
      <p className={cn(
        'text-[14px] font-bold tabular-nums leading-none',
        accent ? 'text-primary' : 'text-foreground'
      )}>
        {value}
      </p>
    </div>
  );
}