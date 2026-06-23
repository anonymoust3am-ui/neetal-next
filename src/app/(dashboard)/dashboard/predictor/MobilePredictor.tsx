'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  ChevronDown,
  CircleOff,
  Filter,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type InputMode = 'marks' | 'rank';
type Bucket = 'safe' | 'target' | 'dream';

interface PredictionCollege {
  name?: string;
  shortName?: string;
  courseName?: string;
  course?: string;
  courseCode?: string;
  rounds?: string;
  bucket?: Bucket | string;
  quotaCodes?: string;
  candidateCategoryCodes?: string;
  allottedCategoryCodes?: string;
  openingRank?: number | string;
  closingRank?: number | string;
  inputRank?: number | string;
  rankGap?: number | string;
  logoColor?: string;
  logoUrl?: string | null;
  image?: string;
  similarCandidates?: Array<{
    rank_num?: number | string;
    round_no?: number | string;
    candidate_category_code?: string;
    allotted_category_code?: string;
    rankDist?: number | string;
  }>;
}

interface PredictionSummary {
  title?: string;
  userRank?: number | string;
  nearbyRange?: number | string;
  rankRange?: number | string;
  safe?: number;
  target?: number;
  dream?: number;
}

interface PredictionResponse {
  success: boolean;
  data: PredictionCollege[];
  summary: PredictionSummary;
  mode: string;
  message?: string;
}

interface PredictorOptions {
  rounds: Array<{ round_no: string; label: string }>;
  courses: Array<{ course_code: string }>;
  categories: Array<{ candidate_category_code: string }>;
  quotas: Array<{ quota_code: string }>;
}

interface OptionsResponse {
  success: boolean;
  data: PredictorOptions;
  message?: string;
}

const EMPTY_OPTIONS: PredictorOptions = { rounds: [], courses: [], categories: [], quotas: [] };

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
}

function formatRank(value: unknown) {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) return '-';
  return Number(value).toLocaleString('en-IN');
}

function formatGap(value: unknown) {
  const formatted = formatRank(value);
  return formatted === '-' ? '-' : `+${formatted}`;
}

function cappedEvidenceRange(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return '1000';
  return String(Math.min(parsed, 1000));
}

function optionValue(option: Record<string, string>) {
  return option.round_no ?? option.course_code ?? option.candidate_category_code ?? option.quota_code ?? '';
}

function optionLabel(option: Record<string, string>) {
  return option.label ?? optionValue(option);
}

function normalizeAssetUrl(value?: string) {
  if (!value) return undefined;
  const baseUrl = apiBaseUrl().replace('/api', '');
  if (value.includes('/data')) {
    const match = value.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (match?.[1]) return `url('${baseUrl}${match[1]}')`;
    if (value.startsWith('/data')) return `url('${baseUrl}${value}')`;
  }
  if (value.startsWith('linear-gradient') || value.startsWith('radial-gradient') || value.startsWith('url(')) return value;
  if (value.startsWith('http')) return `url('${value}')`;
  return value;
}

function initials(name?: string) {
  return (name || 'College').split(' ').filter(Boolean).map(word => word[0]).join('').slice(0, 2).toUpperCase();
}

export default function MobilePredictor() {
  const [inputMode, setInputMode] = useState<InputMode>('marks');
  const [marks, setMarks] = useState('');
  const [rank, setRank] = useState('');
  const [round, setRound] = useState('');
  const [course, setCourse] = useState('');
  const [category, setCategory] = useState('');
  const [quota, setQuota] = useState('');
  const [range, setRange] = useState('1000');
  const [showFilters, setShowFilters] = useState(false);
  const [options, setOptions] = useState<PredictorOptions>(EMPTY_OPTIONS);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [bucket, setBucket] = useState<Bucket | null>(null);
  const [buttonLifted, setButtonLifted] = useState(true);
  const [topControlsVisible, setTopControlsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const lastScrollYRef = useRef(0);
  const scrollStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userValue = inputMode === 'marks' ? marks : rank;
  const canPredict = userValue.trim().length > 0 && !predicting && !optionsLoading;

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      if (scrollStopRef.current) clearTimeout(scrollStopRef.current);
      setHasScrolled(currentY > 120);

      if (currentY < 24) {
        setButtonLifted(true);
        setTopControlsVisible(false);
      } else if (delta > 6) {
        setButtonLifted(false);
        setTopControlsVisible(false);
      } else if (delta < -6) {
        setButtonLifted(true);
        setTopControlsVisible(true);
      }

      lastScrollYRef.current = currentY;
      scrollStopRef.current = setTimeout(() => {
        setButtonLifted(true);
        setTopControlsVisible(false);
      }, 260);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollStopRef.current) clearTimeout(scrollStopRef.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      setOptionsLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (round) params.set('round_no', round);
        if (course) params.set('course_code', course);
        if (category) params.set('candidate_category_code', category);
        const response = await fetch(`${apiBaseUrl()}/ai/options?${params.toString()}`);
        const json = (await response.json()) as OptionsResponse;
        if (!json.success) throw new Error(json.message || 'Could not load filters.');
        if (!cancelled) setOptions(json.data);
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Could not load filters.');
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    }

    loadOptions();
    return () => { cancelled = true; };
  }, [category, course, round]);

  const filteredResults = useMemo(() => {
    const results = prediction?.data ?? [];
    return bucket ? results.filter(college => college.bucket === bucket) : results;
  }, [bucket, prediction]);

  async function predict() {
    if (!userValue.trim()) {
      setError(inputMode === 'marks' ? 'Enter NEET marks first.' : 'Enter AIR rank first.');
      return;
    }

    setPredicting(true);
    setError('');
    setBucket(null);

    try {
      const response = await fetch(`${apiBaseUrl()}/ai/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marks: inputMode === 'marks' ? marks.trim() : null,
          rank: inputMode === 'rank' ? rank.trim() : null,
          round_no: round,
          course_code: course,
          candidate_category_code: category,
          quota_code: quota,
          nearby_range: cappedEvidenceRange(range),
          limit: '30',
        }),
      });
      const json = (await response.json()) as PredictionResponse;
      if (!json.success) throw new Error(json.message || 'Prediction failed.');
      setPrediction(json);
    } catch (caught) {
      setPrediction(null);
      setError(caught instanceof Error ? caught.message : 'Prediction failed.');
    } finally {
      setPredicting(false);
    }
  }

  const summary = prediction?.summary ?? {};
  const counts = {
    all: prediction?.data.length ?? 0,
    safe: summary.safe ?? 0,
    target: summary.target ?? 0,
    dream: summary.dream ?? 0,
  };
  const showFloatingInput = hasScrolled && topControlsVisible;

  return (
    <div className={`min-h-screen bg-background px-4 pt-20 text-foreground ${buttonLifted ? 'pb-40' : 'pb-24'}`}>
      <div
        className={`fixed inset-x-0 top-[72px] z-[1300] border-b border-border bg-surface/95 px-4 py-2 shadow-sm backdrop-blur transition-transform duration-300 ease-out ${
          showFloatingInput ? 'translate-y-0' : '-translate-y-[calc(100%+70px)]'
        }`}
      >
        <div className="mx-auto max-w-md">
          <div className="grid grid-cols-[112px_minmax(0,1fr)_38px] gap-2">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              <ModeButton active={inputMode === 'marks'} onClick={() => { setInputMode('marks'); setRank(''); }}>Mks</ModeButton>
              <ModeButton active={inputMode === 'rank'} onClick={() => { setInputMode('rank'); setMarks(''); }}>AIR</ModeButton>
            </div>
            <input
              type="number"
              value={inputMode === 'marks' ? marks : rank}
              onChange={event => inputMode === 'marks' ? setMarks(event.target.value) : setRank(event.target.value)}
              placeholder={inputMode === 'marks' ? 'Marks' : 'AIR rank'}
              className="h-11 w-full rounded-lg border border-border bg-input px-3 text-sm font-bold text-foreground outline-none focus:border-border-focus"
            />
            <button
              type="button"
              onClick={() => {
                setShowFilters(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex h-11 items-center justify-center rounded-lg border border-border bg-muted text-foreground"
              aria-label="Show filters"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>
      </div>

      <header className="mb-4">
        {/* <p className="text-[10px] font-bold uppercase tracking-widest text-primary">NEET UG</p> */}
        <h1 className="mt-1 text-2xl font-black leading-tight text-foreground">College Predictor</h1>
        {/* <p className="mt-1 text-xs leading-relaxed text-foreground-muted">
          Quick AIQ prediction built for phone use.
        </p> */}
      </header>

      <section className="rounded-xl border border-border bg-surface p-3 shadow-sm">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          <ModeButton active={inputMode === 'marks'} onClick={() => { setInputMode('marks'); setRank(''); }}>Marks</ModeButton>
          <ModeButton active={inputMode === 'rank'} onClick={() => { setInputMode('rank'); setMarks(''); }}>AIR Rank</ModeButton>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-bold text-foreground-muted">
            {inputMode === 'marks' ? 'NEET marks' : 'All India rank'}
          </label>
          <input
            type="number"
            value={inputMode === 'marks' ? marks : rank}
            onChange={event => inputMode === 'marks' ? setMarks(event.target.value) : setRank(event.target.value)}
            placeholder={inputMode === 'marks' ? 'Example: 645' : 'Example: 45000'}
            className="h-12 w-full rounded-lg border border-border bg-input px-3 text-base font-bold text-foreground outline-none focus:border-border-focus"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(open => !open)}
          className="mt-3 flex w-full items-center justify-between rounded-lg border border-border bg-muted px-3 py-2 text-xs font-bold text-foreground"
        >
          <span className="inline-flex items-center gap-2"><Filter size={14} /> Filters</span>
          <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {showFilters && (
          <div className="mt-3 grid gap-3">
            {optionsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-11 animate-pulse rounded-lg bg-skeleton" />)}
              </div>
            ) : (
              <>
                <Select label="Round" value={round} onChange={setRound} options={options.rounds} />
                <Select label="Course" value={course} onChange={setCourse} options={options.courses} />
                <Select label="Category" value={category} onChange={setCategory} options={options.categories} />
                <Select label="Quota" value={quota} onChange={setQuota} options={options.quotas} />
                <label>
                  <span className="mb-1 block text-xs font-bold text-foreground-muted">Evidence range</span>
                  <select value={range} onChange={event => setRange(event.target.value)} className={selectClassName}>
                    <option value="250">+/- 250 ranks</option>
                    <option value="500">+/- 500 ranks</option>
                    <option value="1000">+/- 1K ranks</option>
                  </select>
                </label>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-error/20 bg-error-light px-3 py-2 text-xs font-semibold text-error">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}
      </section>

      <section className="mt-4">
        {!prediction && !predicting && (
          <div className="rounded-xl border border-dashed border-border bg-muted p-6 text-center">
            <Search size={26} className="mx-auto text-primary" />
            <h2 className="mt-3 text-base font-bold text-foreground">Ready when you are</h2>
            <p className="mt-1 text-xs leading-relaxed text-foreground-muted">
              Enter marks or rank and tap predict. Results will appear here.
            </p>
          </div>
        )}

        {predicting && <MobileLoading />}

        {!predicting && prediction && prediction.data.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-muted p-6 text-center">
            <CircleOff size={24} className="mx-auto text-warning" />
            <h2 className="mt-3 text-base font-bold text-foreground">No colleges found</h2>
            <p className="mt-1 text-xs text-foreground-muted">Increase range or remove filters.</p>
          </div>
        )}

        {!predicting && prediction && prediction.data.length > 0 && (
          <div>
            <div
              className={`sticky z-[1250] -mx-4 mb-3 grid grid-cols-4 gap-2 overflow-hidden bg-background/95 px-4 backdrop-blur transition-all duration-300 ${
                topControlsVisible
                  ? `${showFloatingInput ? 'top-[136px]' : 'top-[72px]'} max-h-24 py-2 opacity-100 translate-y-0`
                  : 'top-[72px] max-h-0 py-0 opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              <BucketButton label="All" value={counts.all} active={!bucket} onClick={() => setBucket(null)} icon={BarChart3} />
              <BucketButton label="Safe" value={counts.safe} active={bucket === 'safe'} onClick={() => setBucket('safe')} icon={ShieldCheck} />
              <BucketButton label="Target" value={counts.target} active={bucket === 'target'} onClick={() => setBucket('target')} icon={Target} />
              <BucketButton label="Dream" value={counts.dream} active={bucket === 'dream'} onClick={() => setBucket('dream')} icon={Sparkles} />
            </div>
            <div className="space-y-3">
              {filteredResults.map((college, index) => <MobileCollegeCard key={`${college.name}-${index}`} college={college} summary={summary} />)}
            </div>
          </div>
        )}
      </section>

      <div
        className={`fixed inset-x-0 z-fixed border-t border-border bg-surface/95 px-4 py-3 backdrop-blur transition-[bottom] duration-300 ease-out ${
          buttonLifted ? 'bottom-16' : 'bottom-0'
        }`}
      >
        <button
          type="button"
          onClick={predict}
          disabled={!canPredict}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm disabled:bg-disabled disabled:text-foreground-subtle"
        >
          {predicting ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {predicting ? 'Predicting...' : 'Predict colleges'}
          {!predicting && <ArrowRight size={15} />}
        </button>
      </div>
    </div>
  );
}

const selectClassName = 'h-11 w-full rounded-lg border border-border bg-input px-3 text-sm font-semibold text-foreground outline-none focus:border-border-focus';

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`h-10 rounded-md text-xs font-bold ${active ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted'}`}>
      {children}
    </button>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<Record<string, string>> }) {
  return (
    <label>
      <span className="mb-1 block text-xs font-bold text-foreground-muted">{label}</span>
      <select value={value} onChange={event => onChange(event.target.value)} className={selectClassName}>
        <option value="">All {label}</option>
        {options.map((option, index) => {
          const value = optionValue(option);
          return <option key={`${value}-${index}`} value={value}>{optionLabel(option)}</option>;
        })}
      </select>
    </label>
  );
}

function MobileLoading() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
        <Loader2 size={22} className="animate-spin" />
      </div>
      <h2 className="mt-3 text-base font-bold text-foreground">Building your college map</h2>
      <p className="mt-1 text-xs text-foreground-muted">Matching rank with cutoff evidence.</p>
    </div>
  );
}

function BucketButton({ label, value, active, onClick, icon: Icon }: { label: string; value: number; active: boolean; onClick: () => void; icon: LucideIcon }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-lg border p-2 text-left ${active ? 'border-primary bg-primary-light' : 'border-border bg-surface'}`}>
      <Icon size={14} className="text-primary" />
      <p className="mt-1 text-[10px] font-bold uppercase text-foreground-subtle">{label}</p>
      <p className="text-sm font-black text-foreground">{value}</p>
    </button>
  );
}

function MobileCollegeCard({ college, summary }: { college: PredictionCollege; summary: PredictionSummary }) {
  const [open, setOpen] = useState(false);
  const cover = normalizeAssetUrl(college.image) || 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))';
  const baseUrl = apiBaseUrl().replace('/api', '');
  const logoUrl = college.logoUrl?.startsWith('/data') ? `${baseUrl}${college.logoUrl}` : college.logoUrl;
  const name = college.name || 'Unknown College';
  const rank = college.inputRank ?? summary.userRank;
  const evidence = college.similarCandidates?.slice(0, 3) ?? [];

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative h-32 bg-cover bg-center" style={{ backgroundImage: cover }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white text-xs font-bold" style={{ color: college.logoColor || 'var(--color-primary)' }}>
            {logoUrl ? <img src={logoUrl} alt="" className="h-full w-full object-contain p-1.5" /> : initials(name)}
          </div>
          <div className="min-w-0 text-white">
            <p className="truncate text-sm font-bold">{name}</p>
            <p className="text-xs text-white/80">{college.courseName || college.course || '-'}</p>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-4 gap-2">
          <MiniRank label="Your" value={formatRank(rank)} />
          <MiniRank label="Open" value={formatRank(college.openingRank)} />
          <MiniRank label="Close" value={formatRank(college.closingRank)} />
          <MiniRank label="Gap" value={formatRank(college.rankGap)} />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Pill label="Quota" value={college.quotaCodes || '-'} />
          <Pill label="Candidate" value={college.candidateCategoryCodes || '-'} />
          <Pill label="Allotted" value={college.allottedCategoryCodes || '-'} />
        </div>
        <button type="button" onClick={() => setOpen(value => !value)} className="mt-3 flex w-full items-center justify-between rounded-lg bg-muted px-3 py-2 text-xs font-bold text-foreground">
          Similar evidence
          <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="mt-2 space-y-1.5">
            {evidence.length ? evidence.map((candidate, index) => (
              <div key={index} className="grid grid-cols-[1fr_42px_54px] gap-2 rounded-lg bg-muted px-3 py-2 text-xs">
                <span className="font-mono font-bold text-foreground">{formatRank(candidate.rank_num)}</span>
                <span className="font-bold text-foreground-muted">R{candidate.round_no}</span>
                <span className="text-right font-mono font-bold text-primary">{formatGap(candidate.rankDist)}</span>
              </div>
            )) : (
              <div className="rounded-lg border border-dashed border-border bg-muted p-3 text-center text-xs font-semibold text-foreground-subtle">No similar rows</div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function MiniRank({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-2">
      <p className="text-[9px] font-bold uppercase text-foreground-subtle">{label}</p>
      <p className="mt-0.5 text-xs font-black text-foreground">{value}</p>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold text-foreground-muted">{label}: <b className="text-foreground">{value}</b></span>;
}
