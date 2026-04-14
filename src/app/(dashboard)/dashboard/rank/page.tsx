'use client';

import { useMemo, useState } from 'react';
import {
  Search, BookmarkIcon, GitCompare, GraduationCap,
  Sparkles, ChevronDown,
} from 'lucide-react';
import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from 'clsx';

type Bucket = 'safe' | 'target' | 'dream' | 'out' | 'unknown';

interface College {
  id: number; name: string; state: string; type: 'Government' | 'Private';
  quota: string; fees: number; cutoff: number; bond: boolean;
  rating: number; trend: [number, number, number]; tags: string[];
}

interface CollegeRow extends College { bucket: Bucket; }

type BucketFilter = 'all' | 'safe' | 'target' | 'dream';

const DATA: College[] = [
  { id: 1, name: 'AIIMS New Delhi', state: 'Delhi', type: 'Government', quota: 'AIQ', fees: 1628, cutoff: 42815, bond: false, rating: 4.9, trend: [40200, 41800, 42815], tags: ['AIIMS'] },
  { id: 2, name: 'JIPMER Puducherry', state: 'Puducherry', type: 'Government', quota: 'AIQ', fees: 0, cutoff: 52800, bond: false, rating: 4.7, trend: [50100, 51500, 52800], tags: ['JIPMER'] },
  { id: 3, name: 'Maulana Azad Medical College', state: 'Delhi', type: 'Government', quota: 'AIQ', fees: 3200, cutoff: 49800, bond: true, rating: 4.6, trend: [48000, 49200, 49800], tags: ['Govt'] },
  { id: 4, name: 'VMMC & Safdarjung Hospital', state: 'Delhi', type: 'Government', quota: 'AIQ', fees: 5000, cutoff: 89622, bond: true, rating: 4.4, trend: [85000, 87400, 89622], tags: ['Govt'] },
  { id: 5, name: 'Grant Medical College', state: 'Maharashtra', type: 'Government', quota: 'AIQ', fees: 15000, cutoff: 62140, bond: true, rating: 4.2, trend: [60000, 61200, 62140], tags: ['Govt'] },
  { id: 6, name: 'Madras Medical College', state: 'Tamil Nadu', type: 'Government', quota: 'AIQ', fees: 5000, cutoff: 72400, bond: true, rating: 4.3, trend: [70000, 71500, 72400], tags: ['Govt'] },
  { id: 7, name: 'AIIMS Jodhpur', state: 'Rajasthan', type: 'Government', quota: 'AIQ', fees: 1628, cutoff: 84300, bond: false, rating: 4.5, trend: [80000, 82000, 84300], tags: ['AIIMS'] },
  { id: 8, name: 'B.J. Medical College', state: 'Gujarat', type: 'Government', quota: 'AIQ', fees: 12000, cutoff: 78200, bond: true, rating: 4.1, trend: [75000, 76800, 78200], tags: ['Govt'] },
  { id: 9, name: 'KGMU Lucknow', state: 'Uttar Pradesh', type: 'Government', quota: 'AIQ', fees: 18000, cutoff: 95800, bond: true, rating: 4.0, trend: [92000, 94000, 95800], tags: ['Govt'] },
  { id: 10, name: 'MAMC New Delhi', state: 'Delhi', type: 'Government', quota: 'AIQ', fees: 7200, cutoff: 58340, bond: true, rating: 4.3, trend: [56000, 57400, 58340], tags: ['Govt'] },
  { id: 11, name: 'AIIMS Bhopal', state: 'Madhya Pradesh', type: 'Government', quota: 'AIQ', fees: 1628, cutoff: 112400, bond: false, rating: 4.4, trend: [108000, 110500, 112400], tags: ['AIIMS'] },
  { id: 12, name: 'Sawai Man Singh Medical', state: 'Rajasthan', type: 'Government', quota: 'AIQ', fees: 8500, cutoff: 105000, bond: true, rating: 4.0, trend: [102000, 103500, 105000], tags: ['Govt'] },
  { id: 13, name: 'Kasturba Medical College', state: 'Karnataka', type: 'Private', quota: 'AIQ', fees: 450000, cutoff: 38000, bond: false, rating: 4.5, trend: [36000, 37000, 38000], tags: ['Deemed'] },
  { id: 14, name: 'Manipal College of Medicine', state: 'Karnataka', type: 'Private', quota: 'AIQ', fees: 500000, cutoff: 45000, bond: false, rating: 4.4, trend: [43000, 44000, 45000], tags: ['Deemed'] },
  { id: 15, name: 'Sri Ramachandra Institute', state: 'Tamil Nadu', type: 'Private', quota: 'AIQ', fees: 395000, cutoff: 55000, bond: false, rating: 4.2, trend: [53000, 54000, 55000], tags: ['Deemed'] },
  { id: 16, name: 'AIIMS Rishikesh', state: 'Uttarakhand', type: 'Government', quota: 'AIQ', fees: 1628, cutoff: 97500, bond: false, rating: 4.4, trend: [93000, 95500, 97500], tags: ['AIIMS'] },
  { id: 17, name: 'Lady Hardinge Medical', state: 'Delhi', type: 'Government', quota: 'AIQ', fees: 4000, cutoff: 68200, bond: true, rating: 4.2, trend: [65000, 67000, 68200], tags: ['Govt'] },
  { id: 18, name: 'AIIMS Nagpur', state: 'Maharashtra', type: 'Government', quota: 'AIQ', fees: 1628, cutoff: 132000, bond: false, rating: 4.2, trend: [127000, 130000, 132000], tags: ['AIIMS'] },
];

const CATEGORIES = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'];
const STATES = ['Delhi', 'Rajasthan', 'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Karnataka', 'Uttar Pradesh', 'Puducherry', 'Madhya Pradesh'];
const PAGE_SIZE = 10;

function getBucket(rank: number, cutoff: number): Bucket {
  if (!rank) return 'unknown';
  const r = rank / cutoff;
  if (r <= 0.80) return 'safe';
  if (r <= 1.15) return 'target';
  if (r <= 1.50) return 'dream';
  return 'out';
}

function formatFees(n: number) {
  return n === 0 ? 'Free' : `₹${n.toLocaleString('en-IN')}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getAIInsight(safe: number, target: number, dream: number): string {
  if (safe >= 5) return 'You have a strong set of safe options. Lock in your top safe colleges before exploring targets.';
  if (target >= 5) return 'Most options are in target range — strong but not guaranteed. Add some safe picks to balance your strategy.';
  if (dream >= 3) return 'Your rank puts you in dream territory for most colleges. Check state quota options for better chances.';
  return 'Very few matches. Try relaxing filters or explore state quota seats for your domicile.';
}

const BUCKET_DOT: Record<Bucket, string> = {
  safe: 'bg-success', target: 'bg-warning', dream: 'bg-secondary',
  out: 'bg-error', unknown: 'bg-border',
};

const BUCKET_LABEL: Record<Bucket, string> = {
  safe: 'Safe', target: 'Target', dream: 'Dream', out: 'Not possible', unknown: '—',
};

function StatusBadge({ bucket }: { bucket: Bucket }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted">
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', BUCKET_DOT[bucket])} />
      {BUCKET_LABEL[bucket]}
    </span>
  );
}

function TrendBars({ trend }: { trend: [number, number, number] }) {
  const max = Math.max(...trend);
  return (
    <div className="flex items-end gap-0.5 h-6">
      {trend.map((v, i) => {
        const h = Math.round((v / max) * 20) + 4;
        const dir = i === 0 ? 'flat' : v > trend[i - 1] ? 'up' : 'dn';
        return (
          <div
            key={i}
            title={v.toLocaleString('en-IN')}
            style={{ height: h }}
            className={cn('w-2 rounded-sm',
              dir === 'up' ? 'bg-error/50' : dir === 'dn' ? 'bg-primary/50' : 'bg-border'
            )}
          />
        );
      })}
    </div>
  );
}

function FSelect({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-9 pl-3 pr-7 border border-border rounded-xl bg-surface text-xs
          font-medium text-foreground-muted appearance-none outline-none
          focus:border-primary focus:bg-muted cursor-pointer transition-colors"
      >
        {children}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none" />
    </div>
  );
}

export default function RankExplorerPage() {
  const [rank, setRank] = useState('');
  const [sliderRank, setSliderRank] = useState(50000);
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [quota, setQuota] = useState('');
  const [colType, setColType] = useState('');
  const [query, setQuery] = useState('');
  const [bucketFilter, setBucketFilter] = useState<BucketFilter>('all');
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const effectiveRank = parseInt(rank) || sliderRank;

  const toggleSave = (id: number) =>
    setSaved(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const allRows: CollegeRow[] = useMemo(() => DATA.map(c => ({
    ...c, bucket: getBucket(effectiveRank, c.cutoff),
  })), [effectiveRank]);

  const filtered = useMemo(() => allRows.filter(c => {
    if (state && c.state !== state) return false;
    if (quota && c.quota !== quota) return false;
    if (colType && c.type !== colType) return false;
    if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [allRows, state, quota, colType, query]);

  const bucketed = bucketFilter === 'all' ? filtered : filtered.filter(c => c.bucket === bucketFilter);

  const counts = {
    safe: filtered.filter(c => c.bucket === 'safe').length,
    target: filtered.filter(c => c.bucket === 'target').length,
    dream: filtered.filter(c => c.bucket === 'dream').length,
    out: filtered.filter(c => c.bucket === 'out').length,
  };

  const shortlistedColleges = DATA.filter(c => saved.has(c.id)).map(c => ({
    ...c, bucket: getBucket(effectiveRank, c.cutoff),
  }));

  const BUCKET_BTNS: { key: BucketFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'safe', label: 'Safe' },
    { key: 'target', label: 'Target' },
    { key: 'dream', label: 'Dream' },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* ── filter bar ── */}
      <div className="sticky top-[56px] z-sticky bg-surface border-b border-border shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-2 flex-nowrap overflow-x-auto no-scrollbar">

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <input
              type="number" min={1}
              value={rank}
              onChange={e => { setRank(e.target.value); setVisibleCount(PAGE_SIZE); }}
              placeholder="Your rank"
              className="w-28 h-9 px-3 border border-border rounded-xl bg-surface text-xs
                text-foreground placeholder:text-foreground-subtle outline-none
                focus:border-primary transition-colors"
            />
            <button
              onClick={() => { setRank('50000'); setSliderRank(50000); }}
              className="h-9 px-3 bg-primary-light border border-primary/20 rounded-xl
                text-xs font-semibold text-primary hover:bg-primary/20 transition-colors whitespace-nowrap"
            >
              Use my rank
            </button>
          </div>

          <div className="w-px h-5 bg-border flex-shrink-0" />

          <FSelect value={category} onChange={setCategory}>
            <option value="">Category</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </FSelect>

          <FSelect value={state} onChange={setState}>
            <option value="">All states</option>
            {STATES.map(s => <option key={s}>{s}</option>)}
          </FSelect>

          <FSelect value={quota} onChange={setQuota}>
            <option value="">Quota</option>
            <option>AIQ</option><option>State</option>
          </FSelect>

          <FSelect value={colType} onChange={setColType}>
            <option value="">All types</option>
            <option>Government</option><option>Private</option>
          </FSelect>

          <div className="w-px h-5 bg-border flex-shrink-0" />

          <div className="relative flex-1 min-w-[160px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none" />
            <input
              type="text" value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search college…"
              className="w-full h-9 pl-7 pr-3 border border-border rounded-xl bg-surface text-xs
                text-foreground placeholder:text-foreground-subtle outline-none
                focus:border-primary transition-colors"
            />
          </div>

          <div className="w-px h-5 bg-border flex-shrink-0" />

          <div className="flex border border-border rounded-xl overflow-hidden flex-shrink-0">
            {BUCKET_BTNS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setBucketFilter(key)}
                className={cn(
                  'h-9 px-3 text-xs font-semibold border-r border-border last:border-r-0 transition-colors',
                  bucketFilter === key
                    ? 'bg-primary text-white'
                    : 'bg-surface text-foreground-muted hover:bg-muted',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-5 grid grid-cols-[1fr_260px] gap-5">

        <div>
          {/* rank slider */}
          <div className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-4 py-3 mb-3 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle whitespace-nowrap">
              Rank
            </span>
            <input
              type="range" min={1000} max={200000} step={1000}
              value={rank ? parseInt(rank) : sliderRank}
              onChange={e => {
                const v = parseInt(e.target.value);
                setSliderRank(v);
                setRank(String(v));
              }}
              className="flex-1 accent-primary h-1"
            />
            <span className="text-xs font-bold text-primary min-w-[60px] text-right tabular-nums">
              {(parseInt(rank) || sliderRank).toLocaleString('en-IN')}
            </span>
          </div>

          {/* bucket summary */}
          {effectiveRank > 0 && (
            <div className="flex items-center gap-4 bg-surface border border-border rounded-2xl px-4 py-3 mb-3 shadow-sm flex-wrap">
              <span className="text-xs text-foreground-muted flex-shrink-0">
                Rank <strong className="text-foreground tabular-nums">{effectiveRank.toLocaleString('en-IN')}</strong>
              </span>
              <div className="w-px h-4 bg-border" />
              {[
                { label: 'Safe', count: counts.safe, dot: 'bg-success' },
                { label: 'Target', count: counts.target, dot: 'bg-warning' },
                { label: 'Dream', count: counts.dream, dot: 'bg-secondary' },
                { label: 'Out', count: counts.out, dot: 'bg-error' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
                  <span className="text-xs font-bold text-foreground tabular-nums">{s.count}</span>
                  <span className="text-xs text-foreground-muted">{s.label}</span>
                </div>
              ))}
              <button className="ml-auto text-xs font-medium text-foreground-muted border border-border
                rounded-xl px-3 h-8 hover:bg-muted transition-colors">
                Save preset
              </button>
            </div>
          )}

          {/* table */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '30%' }} /><col style={{ width: '13%' }} />
                <col style={{ width: '8%' }} /><col style={{ width: '13%' }} />
                <col style={{ width: '12%' }} /><col style={{ width: '11%' }} />
                <col style={{ width: '9%' }} /><col style={{ width: '8%' }} />
              </colgroup>
              <thead>
                <tr className="border-b border-border bg-muted">
                  {['College', 'State', 'Quota', 'Closing rank', '3-yr trend', 'Fees / yr', 'Status', ''].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase
                      tracking-wider text-foreground-subtle whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bucketed.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                          <GraduationCap size={20} className="text-foreground-subtle" />
                        </div>
                        <p className="text-sm font-bold text-foreground">No colleges found</p>
                        <p className="text-xs text-foreground-muted">Try changing category, state, or bucket filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bucketed.slice(0, visibleCount).map((c, i) => (
                    <tr key={c.id}
                      className={cn(
                        'hover:bg-hover transition-colors',
                        i < bucketed.slice(0, visibleCount).length - 1 ? 'border-b border-border' : '',
                      )}>
                      <td className="px-3 py-3">
                        <p className="text-xs font-semibold text-foreground truncate">{c.name}</p>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          {c.tags.map(t => (
                            <span key={t} className="text-[10px] px-1.5 py-px rounded-full
                              bg-muted border border-border text-foreground-subtle">{t}</span>
                          ))}
                          {c.bond && (
                            <span className="text-[10px] px-1.5 py-px rounded-full
                              bg-muted border border-border text-foreground-subtle">Bond</span>
                          )}
                          <span className="text-[10px] text-foreground-subtle ml-0.5">★ {c.rating}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-foreground-muted">{c.state}</td>
                      <td className="px-3 py-3 text-xs text-foreground-muted">{c.quota}</td>
                      <td className="px-3 py-3 text-xs font-semibold tabular-nums text-foreground">
                        {c.cutoff.toLocaleString('en-IN')}
                      </td>
                      <td className="px-3 py-3"><TrendBars trend={c.trend} /></td>
                      <td className="px-3 py-3 text-xs text-foreground-muted">{formatFees(c.fees)}</td>
                      <td className="px-3 py-3"><StatusBadge bucket={c.bucket} /></td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleSave(c.id)}
                            className={cn(
                              'w-7 h-7 rounded-xl border flex items-center justify-center transition-colors',
                              saved.has(c.id)
                                ? 'border-primary/30 text-primary bg-primary-light'
                                : 'border-border text-foreground-subtle hover:border-primary/30 hover:text-primary',
                            )}
                          >
                            <BookmarkIcon size={12} fill={saved.has(c.id) ? 'currentColor' : 'none'} />
                          </button>
                          <button className="w-7 h-7 rounded-xl border border-border flex items-center
                            justify-center text-foreground-subtle hover:border-primary/30
                            hover:text-primary transition-colors">
                            <GitCompare size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {bucketed.length > visibleCount && (
            <button
              onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
              className="w-full mt-3 h-10 border border-border rounded-2xl bg-surface text-xs
                font-medium text-foreground-muted hover:bg-muted transition-colors shadow-sm"
            >
              Load more colleges
            </button>
          )}
        </div>

        {/* ── sidebar ── */}
        <div className="flex flex-col gap-3">

          {/* profile card */}
          <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-3">
              Your profile
            </p>
            {[
              { label: 'Rank', value: effectiveRank > 0 ? effectiveRank.toLocaleString('en-IN') : '—' },
              { label: 'Category', value: category || 'General' },
              { label: 'Domicile', value: 'Uttar Pradesh' },
              { label: 'Quota', value: quota || 'AIQ' },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-center py-1.5
                border-b border-border last:border-0">
                <span className="text-xs text-foreground-muted">{r.label}</span>
                <span className="text-xs font-semibold text-foreground">{r.value}</span>
              </div>
            ))}

            {/* AI insight */}
            <div className="mt-3 bg-muted border border-border rounded-xl p-3">
              <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Sparkles size={10} className="text-primary" /> AI insight
              </p>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {getAIInsight(counts.safe, counts.target, counts.dream)}
              </p>
            </div>

            <button className="w-full mt-3 h-9 bg-primary text-white rounded-xl
              text-xs font-semibold hover:bg-primary-hover transition-colors">
              Open college predictor
            </button>
          </div>

          {/* shortlist card */}
          <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-3">
              Shortlisted ({shortlistedColleges.length})
            </p>
            {shortlistedColleges.length === 0 ? (
              <p className="text-xs text-foreground-subtle">No colleges shortlisted yet.</p>
            ) : (
              shortlistedColleges.map(c => (
                <div key={c.id} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                  <span className="text-xs font-medium text-foreground flex-1 truncate">{c.name}</span>
                  <StatusBadge bucket={c.bucket} />
                </div>
              ))
            )}
          </div>

          {/* did you know */}
          <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-2">Did you know?</p>
            <p className="text-xs text-foreground-muted leading-relaxed">
              AIIMS New Delhi has had a <strong className="text-foreground">consistent closing rank</strong> near 42,000 for 3 years —
              one of the most stable cutoffs across all government medical colleges.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
