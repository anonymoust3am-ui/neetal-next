'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, BookmarkIcon, GitCompare, GraduationCap, Info, MapPin, Sparkles } from 'lucide-react';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from "tailwind-merge";

type Bucket = 'safe' | 'target' | 'dream';

interface College {
  id: number; name: string; state: string; type: 'Government' | 'Private';
  fees: number; cutoff: number; bond: boolean; tags: string[];
}

interface CollegeResult extends College { bucket: Bucket; }

const COLLEGES: College[] = [
  { id: 1, name: 'AIIMS New Delhi', state: 'Delhi', type: 'Government', fees: 1628, cutoff: 42815, bond: false, tags: ['AIIMS', 'AIQ'] },
  { id: 2, name: 'JIPMER Puducherry', state: 'Puducherry', type: 'Government', fees: 0, cutoff: 52800, bond: false, tags: ['JIPMER', 'AIQ'] },
  { id: 3, name: 'Maulana Azad Medical College', state: 'Delhi', type: 'Government', fees: 3200, cutoff: 49800, bond: true, tags: ['Government', 'AIQ'] },
  { id: 4, name: 'VMMC & Safdarjung Hospital', state: 'Delhi', type: 'Government', fees: 5000, cutoff: 89622, bond: true, tags: ['Government', 'AIQ'] },
  { id: 5, name: 'Grant Medical College', state: 'Maharashtra', type: 'Government', fees: 15000, cutoff: 62140, bond: true, tags: ['Government', 'AIQ'] },
  { id: 6, name: 'Madras Medical College', state: 'Tamil Nadu', type: 'Government', fees: 5000, cutoff: 72400, bond: true, tags: ['Government', 'AIQ'] },
  { id: 7, name: 'AIIMS Jodhpur', state: 'Rajasthan', type: 'Government', fees: 1628, cutoff: 84300, bond: false, tags: ['AIIMS', 'AIQ'] },
  { id: 8, name: 'B.J. Medical College', state: 'Gujarat', type: 'Government', fees: 12000, cutoff: 78200, bond: true, tags: ['Government', 'AIQ'] },
  { id: 9, name: 'KGMU Lucknow', state: 'Uttar Pradesh', type: 'Government', fees: 18000, cutoff: 95800, bond: true, tags: ['Government', 'AIQ'] },
  { id: 10, name: 'MAMC New Delhi', state: 'Delhi', type: 'Government', fees: 7200, cutoff: 58340, bond: true, tags: ['Government', 'AIQ'] },
  { id: 11, name: 'AIIMS Bhopal', state: 'Madhya Pradesh', type: 'Government', fees: 1628, cutoff: 112400, bond: false, tags: ['AIIMS', 'AIQ'] },
  { id: 12, name: 'Sawai Man Singh Medical', state: 'Rajasthan', type: 'Government', fees: 8500, cutoff: 105000, bond: true, tags: ['Government', 'AIQ'] },
  { id: 13, name: 'Kasturba Medical College', state: 'Karnataka', type: 'Private', fees: 450000, cutoff: 38000, bond: false, tags: ['Private', 'Deemed'] },
  { id: 14, name: 'Manipal College of Medicine', state: 'Karnataka', type: 'Private', fees: 500000, cutoff: 45000, bond: false, tags: ['Private', 'Deemed'] },
  { id: 15, name: 'Sri Ramachandra Institute', state: 'Tamil Nadu', type: 'Private', fees: 395000, cutoff: 55000, bond: false, tags: ['Private', 'Deemed'] },
];

const CATEGORIES = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'];

function getRankBucket(userRank: number, cutoff: number): Bucket | null {
  const r = userRank / cutoff;
  if (r <= 0.80) return 'safe';
  if (r <= 1.15) return 'target';
  if (r <= 1.50) return 'dream';
  return null;
}

function formatFees(n: number) {
  return n === 0 ? 'Free' : `₹${n.toLocaleString('en-IN')}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BUCKET_CARD: Record<Bucket, string> = {
  safe: 'border-success/25 hover:border-success/50',
  target: 'border-warning/25 hover:border-warning/50',
  dream: 'border-secondary/25 hover:border-secondary/50',
};

const BUCKET_BADGE: Record<Bucket, string> = {
  safe: 'bg-success-light text-success',
  target: 'bg-warning-light text-warning',
  dream: 'bg-secondary-light text-secondary',
};

const BUCKET_DOT: Record<Bucket, string> = {
  safe: 'bg-success',
  target: 'bg-warning',
  dream: 'bg-secondary',
};

function ResultCard({
  college, saved, onSave,
}: { college: CollegeResult; saved: boolean; onSave: () => void }) {
  const [compared, setCompared] = useState(false);

  return (
    <div className={cn(
      'flex items-center gap-3 p-3.5 rounded-xl border bg-card',
      'transition-all duration-150',
      BUCKET_CARD[college.bucket],
    )}>
      <div className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center
        justify-center flex-shrink-0 text-foreground-subtle">
        <GraduationCap size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">{college.name}</p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span className="flex items-center gap-1 text-sm text-foreground-muted">
            <MapPin size={10} /> {college.state}
          </span>
          {college.tags.slice(0, 2).map(t => (
            <span key={t} className="text-xs font-medium px-1.5 py-px rounded-full
              bg-muted border border-border text-foreground-muted">{t}</span>
          ))}
          {college.bond && (
            <span className="text-xs font-medium px-1.5 py-px rounded-full
              bg-warning-light text-warning border border-warning/20">Bond</span>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
        <div className="text-right">
          <p className="text-sm text-foreground-subtle font-medium">Closing rank</p>
          <p className="text-xs font-semibold text-foreground tabular-nums">
            {college.cutoff.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-foreground-subtle font-medium">Annual fees</p>
          <p className="text-xs font-semibold text-foreground tabular-nums">
            {formatFees(college.fees)}
          </p>
        </div>
        <span className={cn(
          'flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-full',
          BUCKET_BADGE[college.bucket],
        )}>
          <span className={cn('w-1.5 h-1.5 rounded-full', BUCKET_DOT[college.bucket])} />
          {college.bucket.charAt(0).toUpperCase() + college.bucket.slice(1)}
        </span>
      </div>

      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={() => setCompared(v => !v)}
          className={cn(
            'w-[30px] h-[30px] rounded-lg border flex items-center justify-center transition-colors',
            compared
              ? 'border-primary/30 text-primary bg-primary-light'
              : 'border-border text-foreground-subtle hover:border-primary/30 hover:text-primary',
          )}
          title="Compare"
        >
          <GitCompare size={13} />
        </button>
        <button
          onClick={onSave}
          className={cn(
            'w-[30px] h-[30px] rounded-lg border flex items-center justify-center transition-colors',
            saved
              ? 'border-primary/30 text-primary bg-primary-light'
              : 'border-border text-foreground-subtle hover:border-primary/30 hover:text-primary',
          )}
          title="Shortlist"
        >
          <BookmarkIcon size={13} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}

export default function PredictorPage() {
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('General');
  const [govOnly, setGovOnly] = useState(false);
  const [noBond, setNoBond] = useState(false);
  const [predicted, setPredicted] = useState(false);
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const toggleSave = (id: number) =>
    setSaved(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const results: CollegeResult[] = useMemo(() => {
    if (!predicted || !rank) return [];
    const r = parseInt(rank);
    return COLLEGES
      .filter(c => {
        if (govOnly && c.type !== 'Government') return false;
        if (noBond && c.bond) return false;
        return true;
      })
      .map(c => ({ ...c, bucket: getRankBucket(r, c.cutoff) }))
      .filter((c): c is CollegeResult => c.bucket !== null)
      .sort((a, b) => a.cutoff - b.cutoff);
  }, [predicted, rank, govOnly, noBond]);

  const safe = results.filter(r => r.bucket === 'safe');
  const target = results.filter(r => r.bucket === 'target');
  const dream = results.filter(r => r.bucket === 'dream');

  const BUCKETS: { key: Bucket; items: CollegeResult[]; desc: string }[] = [
    { key: 'safe', items: safe, desc: 'Your rank is comfortably within the closing rank' },
    { key: 'target', items: target, desc: 'Your rank is close to the closing rank' },
    { key: 'dream', items: dream, desc: 'Possible if cutoffs shift down this year' },
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1450px] mx-auto mt-6 space-y-5">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-foreground">College Predictor</h1>
          <p className="text-md text-foreground-muted mt-0.5">
            Get personalized predictions of colleges you can aim for based on your NEET rank and category.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 mb-4">
          <p className="text-xs font-semibold text-foreground mb-4">Your profile</p>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <label className="block">
              <span className="text-s font-semibold uppercase tracking-wide text-foreground-subtle block mb-1.5">
                NEET rank
              </span>
              <input
                type="number" min={1}
                value={rank}
                onChange={e => { setRank(e.target.value); setPredicted(false); }}
                placeholder="e.g. 45000"
                className="w-full h-[38px] px-3 border border-border rounded-lg bg-card text-base
                text-foreground placeholder:text-foreground-subtle focus:outline-none
                focus:border-primary transition-colors"
              />
            </label>

            <label className="block">
              <span className="text-s font-semibold uppercase tracking-wide text-foreground-subtle block mb-1.5">
                Category
              </span>
              <select
                value={category}
                onChange={e => { setCategory(e.target.value); setPredicted(false); }}
                className="w-full h-[38px] px-3 border border-border rounded-lg bg-card text-base
                text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-s font-semibold uppercase tracking-wide text-foreground-subtle block mb-1.5">
                Domicile state
              </span>
              <input
                type="text"
                placeholder="e.g. Uttar Pradesh"
                className="w-full h-[38px] px-3 border border-border rounded-lg bg-card text-base
                text-foreground placeholder:text-foreground-subtle focus:outline-none
                focus:border-primary transition-colors"
              />
            </label>

            <div className="flex flex-col gap-2 justify-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={govOnly}
                  onChange={e => { setGovOnly(e.target.checked); setPredicted(false); }}
                  className="w-3.5 h-3.5 accent-primary" />
                <span className="text-md font-medium text-foreground-muted">Government only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={noBond}
                  onChange={e => { setNoBond(e.target.checked); setPredicted(false); }}
                  className="w-3.5 h-3.5 accent-primary" />
                <span className="text-md font-medium text-foreground-muted">No bond obligation</span>
              </label>
            </div>
          </div>

          <button
            disabled={!rank}
            onClick={() => setPredicted(true)}
            className="flex items-center gap-2 h-10 px-5 bg-primary text-primary-foreground
            rounded-lg text-xs font-semibold transition-colors hover:bg-primary-hover
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Predict colleges <ArrowRight size={15} />
          </button>
        </div>

        <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-info-light
        border border-info/20 mb-6">
          <Info size={14} className="text-info mt-0.5 flex-shrink-0" />
          <p className="text-md text-info leading-relaxed">
            Predictions use previous years' closing ranks. Use Safe with high confidence,
            Target with caution, and Dream as aspirational.
          </p>
        </div>

        {predicted && results.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
              <GraduationCap size={24} className="text-foreground-subtle" />
            </div>
            <p className="text-lg font-semibold text-foreground">No colleges found</p>
            <p className="text-base text-foreground-muted max-w-xs">
              Try removing "Government only" or "No bond" filters.
            </p>
          </div>
        )}

        {predicted && results.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'safe', count: safe.length, label: 'Safe', desc: 'High probability', cls: 'bg-success-light border-success/20', num: 'text-success', lbl: 'text-success' },
                { key: 'target', count: target.length, label: 'Target', desc: 'Moderate chance', cls: 'bg-warning-light border-warning/20', num: 'text-warning', lbl: 'text-warning' },
                { key: 'dream', count: dream.length, label: 'Dream', desc: 'Possible if cutoffs shift', cls: 'bg-secondary-light border-secondary/20', num: 'text-secondary', lbl: 'text-secondary' },
              ].map(s => (
                <div key={s.key} className={cn('rounded-xl p-4 border', s.cls)}>
                  <p className={cn('text-3xl font-bold leading-none', s.num)}>{s.count}</p>
                  <p className={cn('text-xs font-semibold mt-1', s.lbl)}>{s.label}</p>
                  <p className="text-sm text-foreground-subtle mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>

            {BUCKETS.map(({ key, items, desc }) => items.length > 0 && (
              <div key={key}>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className={cn(
                    'flex items-center gap-1.5 text-md font-semibold px-2.5 py-1 rounded-full',
                    BUCKET_BADGE[key],
                  )}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', BUCKET_DOT[key])} />
                    {key.charAt(0).toUpperCase() + key.slice(1)} ({items.length})
                  </span>
                  <span className="text-md text-foreground-muted">{desc}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {items.map(c => (
                    <ResultCard
                      key={c.id}
                      college={c}
                      saved={saved.has(c.id)}
                      onSave={() => toggleSave(c.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}