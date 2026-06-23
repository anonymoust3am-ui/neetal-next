'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronsUpDown,
  CircleOff,
  Database,
  Filter,
  GraduationCap,
  Info,
  ListPlus,
  Loader2,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import MobilePredictor from './MobilePredictor';
import { useAuth } from '@/contexts/AuthContext';
import {
  addChoiceListDetail,
  createChoiceList,
  getChoiceLists,
  getCounsellingOptions,
  type ChoiceListSummary,
} from '@/lib/api';

type InputMode = 'marks' | 'rank';
type Scope = 'ai' | string;
type Bucket = 'safe' | 'target' | 'dream';

interface PredictionResponse {
  success: boolean;
  data: PredictionCollege[];
  summary: PredictionSummary;
  mode: string;
  message?: string;
}

interface OptionsResponse {
  success: boolean;
  data: PredictorOptions;
  message?: string;
}

interface PredictorOptions {
  rounds: Array<{ round_no: string; label: string }>;
  courses: Array<{ course_code: string }>;
  categories: Array<{ candidate_category_code: string }>;
  quotas: Array<{ quota_code: string }>;
  institutes?: Array<{ institute_name: string }>;
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

interface PredictionCollege {
  name?: string;
  shortName?: string;
  courseName?: string;
  course?: string;
  courseCode?: string;
  instituteCode?: string;
  collegeCode?: string;
  rounds?: string;
  state?: string;
  bucket?: Bucket | string;
  quotaCodes?: string;
  candidateCategoryCodes?: string;
  allottedCategoryCodes?: string;
  openingRank?: number | string;
  closingRank?: number | string;
  inputRank?: number | string;
  rankGap?: number | string;
  seats?: number | string;
  image?: string;
  logoUrl?: string;
  logoColor?: string;
  similarCandidates?: Array<{
    rank_num?: number | string;
    round_no?: number | string;
    candidate_category_code?: string;
    allotted_category_code?: string;
    quota_code?: string;
    candidate_category_raw?: string;
    quota_raw?: string;
    rankDist?: number | string;
  }>;
}

const EMPTY_OPTIONS: PredictorOptions = {
  rounds: [],
  courses: [],
  categories: [],
  quotas: [],
  institutes: [],
};

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi NCR',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const RANGE_OPTIONS = [
  { value: '250', label: '+/- 250 ranks' },
  { value: '500', label: '+/- 500 ranks' },
  { value: '1000', label: '+/- 1K ranks' },
];

const BUCKET_META: Record<Bucket, { label: string; icon: LucideIcon; tone: string; text: string; border: string }> = {
  safe: {
    label: 'Safe',
    icon: ShieldCheck,
    tone: 'bg-success-light',
    text: 'text-success',
    border: 'border-success/30',
  },
  target: {
    label: 'Target',
    icon: Target,
    tone: 'bg-warning-light',
    text: 'text-warning',
    border: 'border-warning/30',
  },
  dream: {
    label: 'Dream',
    icon: Sparkles,
    tone: 'bg-secondary-light',
    text: 'text-secondary',
    border: 'border-secondary/30',
  },
};

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
}

function stateSlug(state: string) {
  return state.toLowerCase().replace(/\s+/g, '-');
}

function stateNameFromScope(scope: Scope) {
  if (scope === 'ai') return 'All India MCC';
  return INDIAN_STATES.find(state => stateSlug(state) === scope) ?? scope;
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

function bucketLabel(bucket?: string) {
  if (bucket === 'safe' || bucket === 'target' || bucket === 'dream') return BUCKET_META[bucket].label;
  return 'Review';
}

function optionValue(option: Record<string, string>) {
  return option.round_no ?? option.course_code ?? option.candidate_category_code ?? option.quota_code ?? option.institute_name ?? '';
}

function optionLabel(option: Record<string, string>) {
  return option.label ?? optionValue(option);
}

function getCollegeInitials(college: PredictionCollege) {
  return (college.shortName || college.name || 'College')
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
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

function firstValue(value?: string) {
  return value?.split(',').map(part => part.trim()).find(Boolean) ?? '';
}

function choiceEntryFromCollege(college: PredictionCollege) {
  const institute = college.name || college.shortName || 'Unknown College';
  const course = college.courseName || college.course || college.courseCode || 'MBBS';
  const quota = firstValue(college.quotaCodes) || 'AIQ';
  const category = firstValue(college.candidateCategoryCodes) || firstValue(college.allottedCategoryCodes) || 'General';

  return {
    name: `${institute} - ${course}`,
    institute,
    course,
    quota,
    catagory: category,
  };
}

function getDefaultCounsellingName(mode: string, college: PredictionCollege, options: string[]) {
  if (!options.length) return mode === 'ai' ? 'All India MCC' : college.state || '';

  if (mode === 'ai') {
    return options.find(option => /all india|mcc|aiq/i.test(option)) ?? options[0];
  }

  const state = college.state?.trim();
  if (state) {
    return options.find(option => option.toLowerCase().includes(state.toLowerCase())) ?? options[0];
  }

  return options[0];
}

export default function PredictorPage() {
  const [inputMode, setInputMode] = useState<InputMode>('rank');
  const [scope, setScope] = useState<Scope>('ai');
  const [marks, setMarks] = useState('');
  const [rank, setRank] = useState('');

  const [aiRound, setAiRound] = useState('');
  const [aiCourse, setAiCourse] = useState('');
  const [aiCategory, setAiCategory] = useState('');
  const [aiQuota, setAiQuota] = useState('');
  const [aiRange, setAiRange] = useState('1000');
  const [aiLimit, setAiLimit] = useState('80');

  const [stateRound, setStateRound] = useState('');
  const [stateCourse, setStateCourse] = useState('');
  const [stateCategory, setStateCategory] = useState('');
  const [stateQuota, setStateQuota] = useState('');
  const [stateInstitute, setStateInstitute] = useState('');
  const [stateRange, setStateRange] = useState('1000');
  const [stateLimit, setStateLimit] = useState('80');

  const [aiOptions, setAiOptions] = useState<PredictorOptions>(EMPTY_OPTIONS);
  const [stateOptions, setStateOptions] = useState<PredictorOptions>(EMPTY_OPTIONS);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [bucketFilter, setBucketFilter] = useState<Bucket | null>(null);

  const selectedOptions = scope === 'ai' ? aiOptions : stateOptions;
  const selectedRange = scope === 'ai' ? aiRange : stateRange;
  const selectedLimit = scope === 'ai' ? aiLimit : stateLimit;
  const scopeTitle = stateNameFromScope(scope);
  const userValue = inputMode === 'marks' ? marks : rank;
  const canPredict = userValue.trim().length > 0 && !predicting && !optionsLoading;

  const scopeSubtitle = scope === 'ai'
    ? 'All India quota prediction using MCC counselling data.'
    : `${scopeTitle} state counselling prediction with institute-level filters.`;

  const fetchOptions = useCallback(async (targetScope: Scope) => {
    setOptionsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();

      if (targetScope === 'ai') {
        if (aiRound) params.set('round_no', aiRound);
        if (aiCourse) params.set('course_code', aiCourse);
        if (aiCategory) params.set('candidate_category_code', aiCategory);
      } else {
        if (stateRound) params.set('round_no', stateRound);
        if (stateCourse) params.set('course_code', stateCourse);
        if (stateCategory) params.set('candidate_category_code', stateCategory);
        if (stateQuota) params.set('quota_code', stateQuota);
        if (stateInstitute) params.set('institute_name', stateInstitute);
      }

      const path = targetScope === 'ai'
        ? `/ai/options?${params.toString()}`
        : `/state/${targetScope}/options?${params.toString()}`;
      const response = await fetch(`${apiBaseUrl()}${path}`);
      const json = (await response.json()) as OptionsResponse;

      if (!json.success) throw new Error(json.message || 'Could not load predictor filters.');
      if (targetScope === 'ai') setAiOptions(json.data);
      else setStateOptions(json.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load predictor filters.');
    } finally {
      setOptionsLoading(false);
    }
  }, [aiCategory, aiCourse, aiRound, stateCategory, stateCourse, stateInstitute, stateQuota, stateRound]);

  useEffect(() => {
    fetchOptions(scope);
  }, [fetchOptions, scope]);

  const resetFilters = () => {
    setMarks('');
    setRank('');
    setPrediction(null);
    setBucketFilter(null);
    setError('');

    if (scope === 'ai') {
      setAiRound('');
      setAiCourse('');
      setAiCategory('');
      setAiQuota('');
      setAiRange('1000');
      setAiLimit('80');
    } else {
      setStateRound('');
      setStateCourse('');
      setStateCategory('');
      setStateQuota('');
      setStateInstitute('');
      setStateRange('1000');
      setStateLimit('80');
    }
  };

  const predictColleges = async () => {
    if (!userValue.trim()) {
      setError(inputMode === 'marks' ? 'Enter NEET marks before predicting.' : 'Enter AIR rank before predicting.');
      return;
    }

    setPredicting(true);
    setError('');
    setBucketFilter(null);

    try {
      const basePayload = {
        marks: inputMode === 'marks' ? marks.trim() : null,
        rank: inputMode === 'rank' ? rank.trim() : null,
      };

      const url = scope === 'ai' ? `${apiBaseUrl()}/ai/predict` : `${apiBaseUrl()}/state/${scope}/predict`;
      const payload = scope === 'ai'
        ? {
            ...basePayload,
            round_no: aiRound,
            course_code: aiCourse,
            candidate_category_code: aiCategory,
            quota_code: aiQuota,
            nearby_range: cappedEvidenceRange(aiRange),
            limit: aiLimit,
          }
        : {
            ...basePayload,
            round_no: stateRound,
            course_code: stateCourse,
            candidate_category_code: stateCategory,
            quota_code: stateQuota,
            institute_name: stateInstitute,
            nearby_range: cappedEvidenceRange(stateRange),
            limit: stateLimit,
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await response.json()) as PredictionResponse;

      if (!json.success) throw new Error(json.message || 'Prediction failed.');
      setPrediction(json);
    } catch (caught) {
      setPrediction(null);
      setError(caught instanceof Error ? caught.message : 'Prediction failed. Please adjust filters and try again.');
    } finally {
      setPredicting(false);
    }
  };

  const filteredResults = useMemo(() => {
    const results = prediction?.data ?? [];
    return bucketFilter ? results.filter(college => college.bucket === bucketFilter) : results;
  }, [bucketFilter, prediction]);

  const summary = prediction?.summary ?? {};
  const counts = {
    all: prediction?.data?.length ?? 0,
    safe: summary.safe ?? 0,
    target: summary.target ?? 0,
    dream: summary.dream ?? 0,
  };

  return (
    <>
    <div className="lg:hidden">
      <MobilePredictor />
    </div>

    <div className="no-scrollbar hidden h-screen min-h-screen min-w-[1180px] overflow-hidden overscroll-none bg-background text-foreground pt-20 pb-4 lg:block">
      <main className="mx-auto h-[calc(100vh-6rem)] w-full max-w-[1520px] overflow-hidden px-8">
        {/* <section className="mb-5 grid grid-cols-[minmax(0,1fr)_360px] gap-4">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Badge icon={Database}>NEET UG predictor</Badge>
              <Badge icon={Sparkles}>Desktop workspace</Badge>
            </div>
            <div className="flex items-end justify-between gap-5">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">College Predictor</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground-muted">
                  Enter marks or AIR, choose counselling scope, then compare realistic safe, target, and dream options from historical allotment evidence.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <MiniStat label="Scope" value={scope === 'ai' ? 'AIQ' : 'State'} />
                <MiniStat label="Range" value={selectedRange === '100000' ? '100K' : `${Number(selectedRange) / 1000}K`} />
                <MiniStat label="Cards" value={selectedLimit} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Info size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Simple workflow</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground-muted">
                  Fill required rank/marks first. Filters are optional and help narrow the evidence.
                </p>
              </div>
            </div>
          </div>
        </section> */}

        <section className="grid h-full min-h-0 grid-cols-[390px_minmax(0,1fr)] gap-4">
          <aside className="sticky top-20 flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="shrink-0 border-b border-border px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">Controls</p>
                  <h2 className="mt-1 text-base font-bold text-foreground">Refine prediction</h2>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-semibold text-foreground-muted transition-colors hover:bg-hover hover:text-foreground"
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              </div>
            </div>

            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <StepHeader number="01" title="Counselling" />
              <StringSelectField
                label="Choose scope"
                value={scope}
                onChange={(value) => {
                  setScope(value);
                  setPrediction(null);
                  setBucketFilter(null);
                }}
                options={[
                  { value: 'ai', label: 'All India MCC' },
                  ...INDIAN_STATES.map(state => ({ value: stateSlug(state), label: state })),
                ]}
              />

              {/* <ScopeSummary title={scopeTitle} subtitle={scopeSubtitle} loading={optionsLoading} /> */}

              <StepHeader number="02" title="Your score" />
              <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                <ModeButton active={inputMode === 'marks'} onClick={() => { setInputMode('marks'); setRank(''); }}>Marks</ModeButton>
                <ModeButton active={inputMode === 'rank'} onClick={() => { setInputMode('rank'); setMarks(''); }}>AIR Rank</ModeButton>
              </div>

              {inputMode === 'marks' ? (
                <Field label="NEET marks" hint="0 to 720">
                  <input
                    type="number"
                    min="0"
                    max="720"
                    value={marks}
                    onChange={event => setMarks(event.target.value)}
                    placeholder="Example: 645"
                    className={inputClassName}
                  />
                </Field>
              ) : (
                <Field label="All India rank" hint="AIR">
                  <input
                    type="number"
                    min="1"
                    value={rank}
                    onChange={event => setRank(event.target.value)}
                    placeholder="Example: 45000"
                    className={inputClassName}
                  />
                </Field>
              )}

              <StepHeader number="03" title={scope === 'ai' ? 'All India filters' : 'State filters'} />
              {optionsLoading ? (
                <FilterSkeleton />
              ) : (
                <div>
                  <SelectField label="Round" value={scope === 'ai' ? aiRound : stateRound} onChange={scope === 'ai' ? setAiRound : setStateRound} options={selectedOptions.rounds} />
                  <SelectField label="Quota" value={scope === 'ai' ? aiQuota : stateQuota} onChange={scope === 'ai' ? setAiQuota : setStateQuota} options={selectedOptions.quotas} />
                  <SelectField label="Course" value={scope === 'ai' ? aiCourse : stateCourse} onChange={scope === 'ai' ? setAiCourse : setStateCourse} options={selectedOptions.courses} />
                  <SelectField label="Candidate category" value={scope === 'ai' ? aiCategory : stateCategory} onChange={scope === 'ai' ? setAiCategory : setStateCategory} options={selectedOptions.categories} />
                  {scope !== 'ai' && (
                    <SelectField label="Institute" value={stateInstitute} onChange={setStateInstitute} options={selectedOptions.institutes ?? []} />
                  )}
                </div>
              )}

              <StepHeader number="04" title="Result size" />
              <StringSelectField
                label="Nearby evidence range"
                value={scope === 'ai' ? aiRange : stateRange}
                onChange={(value) => scope === 'ai' ? setAiRange(value) : setStateRange(value)}
                options={RANGE_OPTIONS}
              />
              {/* <Field label="College card limit" hint="5 to 80">
                <input
                  type="number"
                  min="5"
                  max="80"
                  value={scope === 'ai' ? aiLimit : stateLimit}
                  onChange={event => scope === 'ai' ? setAiLimit(event.target.value) : setStateLimit(event.target.value)}
                  className={inputClassName}
                />
              </Field> */}
            </div>

            <div className="shrink-0 border-t border-border bg-muted px-5 py-4">
              {error && (
                <div className="mb-3 flex items-start gap-2 rounded-lg border border-error/20 bg-error-light px-3 py-2 text-xs font-medium text-error">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <button
                type="button"
                onClick={predictColleges}
                disabled={!canPredict}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled disabled:text-foreground-subtle"
              >
                {predicting ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {predicting ? 'Predicting...' : 'Predict colleges'}
                {!predicting && <ArrowRight size={15} />}
              </button>
            </div>
          </aside>

          <section className="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm">
            {!prediction && !predicting && <EmptyState inputMode={inputMode} scopeTitle={scopeTitle} />}
            {!predicting && prediction && !prediction.data.length && <NoResults />}
            {!predicting && prediction && prediction.data.length > 0 && (
              <div className="flex h-full min-h-0 flex-col gap-4">
                <div className="shrink-0 grid grid-cols-5 gap-3">
                  <MetricButton label="All cards" value={counts.all} icon={BarChart3} active={!bucketFilter} onClick={() => setBucketFilter(null)} />
                  <MetricButton label="Safe" value={counts.safe} icon={ShieldCheck} tone="safe" active={bucketFilter === 'safe'} onClick={() => setBucketFilter('safe')} />
                  <MetricButton label="Target" value={counts.target} icon={Target} tone="target" active={bucketFilter === 'target'} onClick={() => setBucketFilter('target')} />
                  <MetricButton label="Dream" value={counts.dream} icon={Sparkles} tone="dream" active={bucketFilter === 'dream'} onClick={() => setBucketFilter('dream')} />
                  <div className="rounded-lg border border-border bg-muted p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">User rank</p>
                    <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{formatRank(summary.userRank)}</p>
                  </div>
                </div>

                {/* <div className="shrink-0 flex items-center justify-between gap-4 rounded-lg border border-border bg-muted px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">{summary.title || `${scopeTitle} prediction`}</p>
                    <p className="mt-1 text-xs text-foreground-muted">
                      Showing {filteredResults.length} of {prediction.data.length} colleges
                      {bucketFilter ? ` in ${bucketLabel(bucketFilter).toLowerCase()} bucket` : ''}.
                    </p>
                  </div>
                  <div className="rounded-md bg-card px-3 py-2 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">Evidence range</p>
                    <p className="mt-1 text-sm font-bold text-foreground">+/- {formatRank(summary.nearbyRange || summary.rankRange)}</p>
                  </div>
                </div> */}

                <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
                  <div className="grid gap-3">
                    {filteredResults.map((college, index) => (
                      <CollegeCard key={`${college.name ?? 'college'}-${index}`} college={college} summary={summary} mode={prediction.mode} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {predicting && <ResultsLoadingOverlay />}
          </section>
        </section>
      </main>
    </div>
    </>
  );
}

const inputClassName = 'h-11 w-full rounded-md border border-border bg-input px-3 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-foreground-subtle focus:border-border-focus disabled:cursor-not-allowed disabled:bg-disabled';

function StepHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-3 mt-5 first:mt-0 flex items-center gap-2">
      <span className="font-mono text-[10px] font-bold text-foreground-subtle">{number}</span>
      <span className="h-px flex-1 bg-border" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">{title}</span>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 flex items-center justify-between gap-2 text-xs font-bold text-foreground-muted">
        <span>{label}</span>
        {hint && <span className="font-medium text-foreground-subtle">{hint}</span>}
      </span>
      <span className="relative block">
        {children}
      </span>
    </label>
  );
}

function DropdownMenu({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div
      className="relative"
      tabIndex={-1}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-md border border-border bg-input px-3 text-left text-sm font-semibold text-foreground outline-none transition-colors hover:border-border-focus focus:border-border-focus"
      >
        <span className={`min-w-0 flex-1 truncate ${value ? 'text-foreground' : 'text-foreground-muted'}`}>
          {selectedLabel}
        </span>
        <ChevronDown size={14} className={`shrink-0 text-foreground-subtle transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          <div className="max-h-56 overflow-y-auto p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {options.map((option, index) => {
              const selected = option.value === value;

              return (
                <button
                  key={`${option.value}-${index}`}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`mt-1 first:mt-0 flex h-9 w-full items-center rounded-md px-2.5 text-left text-xs font-bold transition-colors ${
                    selected ? 'bg-primary text-primary-foreground' : 'text-foreground-muted hover:bg-hover hover:text-foreground'
                  }`}
                  title={option.label}
                >
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
            {!options.length && (
              <div className="rounded-md border border-dashed border-border px-2.5 py-3 text-center text-xs font-semibold text-foreground-subtle">
                No options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StringSelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <Field label={label}>
      <DropdownMenu value={value} placeholder={`All ${label}`} options={options} onChange={onChange} />
    </Field>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<Record<string, string>>;
}) {
  const allLabel = `All ${label}`;
  const dropdownOptions = [
    { value: '', label: allLabel },
    ...options.map(option => ({ value: optionValue(option), label: optionLabel(option) })),
  ];

  return (
    <Field label={label}>
      <DropdownMenu value={value} placeholder={allLabel} options={dropdownOptions} onChange={onChange} />
    </Field>
  );
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-md text-xs font-bold transition-colors ${
        active ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function ScopeSummary({ title, subtitle, loading }: { title: string; subtitle: string; loading: boolean }) {
  return (
    <div className="mb-5 rounded-lg border border-border bg-muted p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <GraduationCap size={17} />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-foreground-muted">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[84px] rounded-lg border border-border bg-muted px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">{label}</p>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}

function Badge({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-bold text-foreground-muted">
      <Icon size={12} className="text-primary" />
      {children}
    </span>
  );
}

function FilterSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index}>
          <div className="mb-1.5 h-3 w-24 animate-pulse rounded-sm bg-skeleton" />
          <div className="h-11 animate-pulse rounded-md bg-skeleton" />
        </div>
      ))}
    </div>
  );
}

function ResultsLoadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/90 backdrop-blur-sm">
      <div className="w-[360px] rounded-xl border border-border bg-modal p-6 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light text-primary">
          <Loader2 size={26} className="animate-spin" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-foreground">Building your college map</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
          Matching your rank with cutoff evidence and counselling filters.
        </p>
      </div>
    </div>
  );
}

function EmptyState({ inputMode, scopeTitle }: { inputMode: InputMode; scopeTitle: string }) {
  return (
    <div className="flex min-h-full items-center justify-center rounded-lg border border-dashed border-border bg-muted p-10 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary-light text-primary">
          <Search size={28} />
        </div>
        <h2 className="mt-5 text-xl font-bold text-foreground">Ready for a prediction</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
          Enter your {inputMode === 'marks' ? 'marks' : 'AIR rank'} and run the predictor for {scopeTitle}. Results will appear here with clear safe, target, and dream buckets.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2 text-left">
          <HintCard icon={Filter} title="Filters" text="Optional" />
          <HintCard icon={TrendingUp} title="Range" text="Adjustable" />
          <HintCard icon={Building2} title="Output" text="College cards" />
        </div>
      </div>
    </div>
  );
}

function HintCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <Icon size={16} className="text-primary" />
      <p className="mt-2 text-xs font-bold text-foreground">{title}</p>
      <p className="mt-0.5 text-[11px] text-foreground-subtle">{text}</p>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-lg bg-skeleton" />)}
      </div>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-44 animate-pulse rounded-xl bg-skeleton" />
      ))}
    </div>
  );
}

function NoResults() {
  return (
    <div className="flex min-h-full items-center justify-center rounded-lg border border-dashed border-border bg-muted p-10 text-center">
      <div className="max-w-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-warning-light text-warning">
          <CircleOff size={24} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-foreground">No colleges found</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
          Increase the evidence range, remove one or two filters, or switch from institute-specific search to all institutes.
        </p>
      </div>
    </div>
  );
}

function MetricButton({
  label,
  value,
  icon: Icon,
  tone,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: Bucket;
  active: boolean;
  onClick: () => void;
}) {
  const meta = tone ? BUCKET_META[tone] : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition-all hover:-translate-y-0.5 ${
        active ? 'border-primary bg-primary-light shadow-sm' : 'border-border bg-muted hover:bg-hover'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">{label}</p>
        <Icon size={16} className={meta?.text ?? 'text-primary'} />
      </div>
      <p className={`mt-2 text-2xl font-bold tabular-nums ${meta?.text ?? 'text-foreground'}`}>{value}</p>
    </button>
  );
}

function CollegeCard({ college, summary, mode }: { college: PredictionCollege; summary: PredictionSummary; mode: string }) {
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const initials = getCollegeInitials(college);
  const name = college.name || 'Unknown College';
  const course = college.courseName || college.course || '-';
  const bucket = college.bucket === 'safe' || college.bucket === 'target' || college.bucket === 'dream' ? college.bucket : null;
  const meta = bucket ? BUCKET_META[bucket] : null;
  const BucketIcon = meta?.icon ?? CheckCircle2;
  const baseUrl = apiBaseUrl().replace('/api', '');
  const image = normalizeAssetUrl(college.image) || 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))';
  const logoUrl = college.logoUrl?.startsWith('/data') ? `${baseUrl}${college.logoUrl}` : college.logoUrl;
  const logoColor = college.logoColor || 'var(--color-primary)';
  const userRank = college.inputRank ?? summary.userRank;
  const evidence = college.similarCandidates?.slice(0, 3) ?? [];

  return (
    <article
      onClick={() => setPinnedOpen(open => !open)}
      className={`group cursor-pointer rounded-xl border bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${meta?.border ?? 'border-border'}`}
    >
      <div className="grid grid-cols-[148px_minmax(0,1fr)] gap-3">
        <div
          className="relative h-full min-h-[126px] overflow-hidden rounded-lg bg-cover bg-center"
          style={{ backgroundImage: image }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
          <div className="absolute left-2 top-2">
            <span className={`inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold shadow-sm ${meta?.text ?? 'text-foreground'}`}>
              <BucketIcon size={11} />
              {bucketLabel(college.bucket)}
            </span>
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex items-end gap-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/70 bg-white text-xs font-bold shadow-md" style={{ color: logoColor }}>
              {logoUrl ? <img src={logoUrl} alt="" className="h-full w-full object-contain p-1.5" /> : initials}
            </div>
            <div className="min-w-0 text-white">
              <p className="truncate text-xs font-bold drop-shadow">{college.shortName || initials}</p>
              <p className="mt-0.5 inline-flex rounded-md bg-black/30 px-1.5 py-0.5 text-[10px] font-bold">
                {college.courseCode || course}
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-foreground">{name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-foreground-muted">
                    <span>{college.shortName || 'Medical College'}</span>
                    <span className="text-border-strong">|</span>
                    <span>{course}</span>
                    <span className="text-border-strong">|</span>
                    <span>Rounds {college.rounds || '-'}</span>
                    {mode !== 'ai' && (
                      <>
                        <span className="text-border-strong">|</span>
                        <span className="inline-flex items-center gap-1"><MapPin size={11} /> {college.state || 'State'}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setShowChoiceModal(true);
                    }}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-[10px] font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
                  >
                    <ListPlus size={12} />
                    Add
                  </button>
                  <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-bold text-foreground-subtle">
                    <ChevronsUpDown size={12} />
                    {pinnedOpen ? 'Hide' : 'Info'}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                <RankBox label="Your rank" value={formatRank(userRank)} strong />
                <RankBox label="Opening" value={formatRank(college.openingRank)} />
                <RankBox label="Closing" value={formatRank(college.closingRank)} />
                <RankBox label="Gap" value={formatRank(college.rankGap)} tone={meta?.text} />
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <InfoPill label="Quota" value={college.quotaCodes || '-'} />
                <InfoPill label="Candidate" value={college.candidateCategoryCodes || '-'} />
                <InfoPill label="Allotted" value={college.allottedCategoryCodes || '-'} />
              </div>

              <p className="mt-2 text-[10px] font-semibold text-foreground-subtle">
                Hover or click card to show similar-candidate evidence.
              </p>
            </div>

            <div
              className={`mt-0 overflow-hidden rounded-lg border border-border bg-muted transition-all duration-300 ${
                pinnedOpen ? 'mt-3 max-h-52 opacity-100' : 'max-h-0 opacity-0 group-hover:mt-3 group-hover:max-h-52 group-hover:opacity-100'
              }`}
            >
              <div className="p-2.5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">Similar evidence</p>
                  <span className="rounded-full bg-card px-2 py-0.5 text-[10px] font-bold text-foreground-muted">
                    {college.similarCandidates?.length ?? 0} rows
                  </span>
                </div>
                {evidence.length ? (
                  <div className="space-y-1.5">
                    {evidence.map((candidate, index) => (
                      <div key={index} className="grid grid-cols-[72px_48px_minmax(0,1fr)_62px] items-center gap-2 rounded-md bg-card px-2 py-1.5 text-[11px]">
                        <span className="font-mono font-bold text-foreground">{formatRank(candidate.rank_num)}</span>
                        <span className="font-semibold text-foreground-muted">R{candidate.round_no ?? '-'}</span>
                        <span className="truncate font-semibold text-foreground-muted">
                          {candidate.candidate_category_code || '-'} to {candidate.allotted_category_code || '-'}
                        </span>
                        <span className="text-right font-mono font-bold text-primary">{formatGap(candidate.rankDist)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[62px] items-center justify-center rounded-md border border-dashed border-border bg-card text-xs font-semibold text-foreground-subtle">
                    No similar rows
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showChoiceModal && typeof document !== 'undefined' && createPortal(
        <PredictorChoiceModal
          college={college}
          mode={mode}
          onClose={() => setShowChoiceModal(false)}
        />,
        document.body,
      )}
    </article>
  );
}

function PredictorChoiceModal({ college, mode, onClose }: {
  college: PredictionCollege;
  mode: string;
  onClose: () => void;
}) {
  const { firebaseUser } = useAuth();
  const [lists, setLists] = useState<ChoiceListSummary[]>([]);
  const [counsellingOptions, setCounsellingOptions] = useState<string[]>([]);
  const [counselling, setCounselling] = useState('');
  const [selectedListId, setSelectedListId] = useState('');
  const [createNew, setCreateNew] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const entry = choiceEntryFromCollege(college);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!firebaseUser) {
        setError('Please login again to add choices.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const token = await firebaseUser.getIdToken();
        const [choiceRes, counsellingRes] = await Promise.all([
          getChoiceLists(token, { limit: 100 }),
          getCounsellingOptions(),
        ]);

        if (!mounted) return;

        const options = counsellingRes.flatMap(option => option.bodies.map(body => body.name));
        const defaultCounselling = getDefaultCounsellingName(mode, college, options);
        const normalizedOptions = defaultCounselling && !options.includes(defaultCounselling)
          ? [defaultCounselling, ...options]
          : options;
        const filteredLists = choiceRes.choiceLists.filter(list => list.caunselling === defaultCounselling);

        setLists(choiceRes.choiceLists);
        setCounsellingOptions(normalizedOptions);
        setCounselling(defaultCounselling);
        setSelectedListId(filteredLists[0]?.id ?? choiceRes.choiceLists[0]?.id ?? '');
        setCreateNew(choiceRes.choiceLists.length === 0);
      } catch (caught) {
        if (!mounted) return;
        setError(caught instanceof Error ? caught.message : 'Could not load choice lists.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [college, firebaseUser, mode]);

  const matchingLists = useMemo(
    () => lists.filter(list => list.caunselling === counselling),
    [counselling, lists],
  );
  const visibleLists = useMemo(
    () => matchingLists.length ? matchingLists : lists,
    [lists, matchingLists],
  );
  const selectedList = visibleLists.find(list => list.id === selectedListId);

  useEffect(() => {
    if (!visibleLists.length) {
      setSelectedListId('');
      return;
    }
    if (!visibleLists.some(list => list.id === selectedListId)) {
      setSelectedListId(visibleLists[0].id);
    }
  }, [selectedListId, visibleLists]);

  const submit = async () => {
    if (!firebaseUser) {
      setError('Please login again to add choices.');
      return;
    }
    if (!counselling) {
      setError('Select counselling first.');
      return;
    }
    if (createNew && !newListName.trim()) {
      setError('Enter a name for the new list.');
      return;
    }
    if (!createNew && !selectedListId) {
      setError('Select an existing list or create a new one.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const token = await firebaseUser.getIdToken();
      const list = createNew
        ? await createChoiceList(token, { name: newListName.trim(), caunselling: counselling })
        : selectedList;

      if (!list?.id) throw new Error('Choice list not found.');

      await addChoiceListDetail(token, list.id, {
        ...entry,
        caunselling: counselling,
        insertAt: createNew ? 0 : selectedList?.detailsCount ?? 0,
      });

      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not add this college.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center px-3 py-4"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />
      <div className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-[23rem] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:max-w-lg">
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Choice list</p>
            <h2 className="mt-1 text-sm font-bold text-foreground sm:text-base">Add college to list</h2>
            <p className="mt-1 truncate text-xs font-semibold text-foreground-muted">{entry.institute}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-foreground-subtle transition hover:bg-hover hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[calc(100dvh-8rem)] space-y-3 overflow-y-auto p-4 sm:space-y-4 sm:p-5">
          {/* <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-muted p-1.5 text-[11px] font-bold text-foreground-muted sm:gap-2 sm:p-2 sm:text-xs">
            <span className="truncate rounded-lg bg-card px-2 py-1.5">{entry.course}</span>
            <span className="truncate rounded-lg bg-card px-2 py-1.5">{entry.quota}</span>
            <span className="truncate rounded-lg bg-card px-2 py-1.5">{entry.catagory}</span>
          </div> */}

          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted text-sm font-semibold text-foreground-muted">
              <Loader2 size={16} className="mr-2 animate-spin" />
              Loading lists
            </div>
          ) : (
            <>
              {error && (
                <div className="rounded-xl border border-error/20 bg-error-light px-3 py-2 text-xs font-semibold text-error">
                  {error}
                </div>
              )}

              <div className="block">
                <span className="text-xs font-bold text-foreground-muted">Counselling</span>
                <div className="mt-1.5">
                  <DropdownMenu
                    value={counselling}
                    placeholder="Select counselling"
                    options={counsellingOptions.map(option => ({ value: option, label: option }))}
                    onChange={(value) => {
                      setCounselling(value);
                      setError('');
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1.5">
                <button
                  type="button"
                  onClick={() => setCreateNew(false)}
                  className={`h-10 rounded-lg text-xs font-bold transition ${!createNew ? 'bg-card text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'}`}
                >
                  Existing list
                </button>
                <button
                  type="button"
                  onClick={() => setCreateNew(true)}
                  className={`h-10 rounded-lg text-xs font-bold transition ${createNew ? 'bg-card text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'}`}
                >
                  Create new
                </button>
              </div>

              {createNew ? (
                <label className="block">
                  <span className="text-xs font-bold text-foreground-muted">New list name</span>
                  <input
                    value={newListName}
                    onChange={(event) => {
                      setNewListName(event.target.value);
                      setError('');
                    }}
                    placeholder="e.g. AIQ Round 1 main list"
                    className="mt-1.5 h-11 w-full rounded-xl border border-border bg-muted px-3 text-sm font-semibold text-foreground outline-none transition placeholder:text-foreground-subtle focus:border-primary focus:bg-card"
                  />
                </label>
              ) : (
                <div className="block">
                  <span className="text-xs font-bold text-foreground-muted">Existing choice list</span>
                  <div className="mt-1.5">
                    <DropdownMenu
                      value={selectedListId}
                      placeholder="Select list"
                      options={visibleLists.map(list => ({
                        value: list.id,
                        label: `${list.name} (${list.detailsCount})`,
                      }))}
                      onChange={(value) => {
                        setSelectedListId(value);
                        setError('');
                      }}
                    />
                  </div>
                  {!matchingLists.length && lists.length > 0 && (
                    <p className="mt-1.5 text-[11px] font-semibold text-foreground-subtle">
                      No list found for this counselling. Showing all lists.
                    </p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={saving}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : createNew ? <Plus size={16} /> : <ListPlus size={16} />}
                {saving ? 'Adding...' : 'Add to choice list'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-bold text-foreground-muted">
      {label}: <span className="text-foreground">{value}</span>
    </span>
  );
}

function RankBox({ label, value, strong = false, tone }: { label: string; value: string; strong?: boolean; tone?: string }) {
  return (
    <div className="rounded-md border border-border bg-muted px-2.5 py-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">{label}</p>
      <p className={`mt-1 text-sm font-bold ${tone ?? (strong ? 'text-primary' : 'text-foreground')}`}>{value}</p>
    </div>
  );
}
