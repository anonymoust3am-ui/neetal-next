'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, SlidersHorizontal, X, Building2,
  MapPin, ChevronRight, ChevronLeft, ChevronDown,
  GraduationCap, Loader2,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ─── types ────────────────────────────────────────────────────────────────────
interface Institute {
  id: number;
  name: string;
  university: { id: number; name: string };
  state: string;
  local_distinction?: string;
  institute_type: string;
  beds?: number;
  logo_url: string;
  cover_url: string;
  fee: { range: { min: number; max: number } };
  seats: number;
}
interface FilterData {
  institute_types: string[];
  states: string[];
  universities: { id: number; name: string }[];
}

type ApiRecord = Record<string, unknown>;

function asRecord(value: unknown): ApiRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as ApiRecord
    : null;
}

function asInstituteArray(value: unknown): Institute[] | null {
  return Array.isArray(value) ? value as Institute[] : null;
}

function asNumber(value: unknown): number | null {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function normalizeInstituteResponse(json: unknown) {
  const root = asRecord(json);
  const data = asRecord(root?.data);
  const pagination = asRecord(data?.pagination) ?? asRecord(root?.pagination) ?? asRecord(data?.meta) ?? asRecord(root?.meta);

  const institutes =
    asInstituteArray(data?.institutes) ??
    asInstituteArray(root?.institutes) ??
    asInstituteArray(data?.data) ??
    asInstituteArray(root?.data) ??
    [];

  const total =
    asNumber(data?.total) ??
    asNumber(root?.total) ??
    asNumber(pagination?.total) ??
    asNumber(pagination?.totalItems) ??
    asNumber(pagination?.totalCount) ??
    asNumber(pagination?.count);

  const pageSize =
    asNumber(data?.page_size) ??
    asNumber(root?.page_size) ??
    asNumber(data?.pageSize) ??
    asNumber(root?.pageSize) ??
    asNumber(pagination?.page_size) ??
    asNumber(pagination?.pageSize) ??
    asNumber(pagination?.limit);

  const page =
    asNumber(data?.page) ??
    asNumber(root?.page) ??
    asNumber(pagination?.page);

  return { institutes, total, pageSize, page };
}

// ─── helpers ──────────────────────────────────────────────────────────────────
function fmtFee(n: number) {
  if (!n) return 'N/A';
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n.toLocaleString()}`;
}

const TYPE_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  'INI (Institute of National Importance)':  { bg: '#ccfbf1', text: '#0f766e', dot: '#0d9488' },
  'Government Institute':                    { bg: '#dcfce7', text: '#15803d', dot: '#16a34a' },
  'Deemed':                                  { bg: '#ede9fe', text: '#6d28d9', dot: '#7c3aed' },
  'Private Institute (State University)':    { bg: '#fef3c7', text: '#b45309', dot: '#d97706' },
  'State Private University':                { bg: '#fef3c7', text: '#b45309', dot: '#d97706' },
  'State Society/PPP (State University)':    { bg: '#e0f2fe', text: '#0369a1', dot: '#0ea5e9' },
  'AFMS':                                    { bg: '#fee2e2', text: '#b91c1c', dot: '#dc2626' },
};
function ts(t: string) {
  return TYPE_STYLE[t] ?? { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' };
}
function shortType(t: string) {
  return t
    .replace(' (Institute of National Importance)', '')
    .replace(' Institute (State University)', '')
    .replace(' (State University)', '');
}

const GRAD_FALLBACKS = [
  'linear-gradient(135deg,#ccfbf1 0%,#a7f3d0 100%)',
  'linear-gradient(135deg,#ede9fe 0%,#c4b5fd 100%)',
  'linear-gradient(135deg,#e0f2fe 0%,#bae6fd 100%)',
  'linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)',
  'linear-gradient(135deg,#fee2e2 0%,#fecaca 100%)',
  'linear-gradient(135deg,#f0fdf4 0%,#bbf7d0 100%)',
];

// ─── College Card ─────────────────────────────────────────────────────────────
function CollegeCard({ c }: { c: Institute }) {
  const [imgErr,  setImgErr]  = useState(false);
  const [logoErr, setLogoErr] = useState(false);
  const style = ts(c.institute_type);
  const feeMin = c.fee?.range?.min ?? 0;
  const feeMax = c.fee?.range?.max ?? 0;
  const feeStr = feeMin === feeMax ? fmtFee(feeMin) : `${fmtFee(feeMin)}–${fmtFee(feeMax)}`;
  const grad   = GRAD_FALLBACKS[c.id % GRAD_FALLBACKS.length];

  return (
    <Link
      href={`/dashboard/colleges/${c.id}`}
      className="group bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/25 transition-all duration-250 flex flex-col"
    >
      {/* ── cover ── */}
      <div className="relative h-36 overflow-hidden shrink-0">
        {!imgErr ? (
          <img
            src={c.cover_url} alt=""
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full" style={{ background: grad }} />
        )}
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        {/* type badge */}
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-sm"
          style={{ background: style.bg + 'ee', color: style.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: style.dot }} />
          {shortType(c.institute_type)}
        </div>

        {/* logo */}
        <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white border-2 border-white/90 shadow-lg overflow-hidden shrink-0">
          {!logoErr ? (
            <img
              src={c.logo_url} alt=""
              className="w-full h-full object-contain p-0.5"
              onError={() => setLogoErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Building2 size={14} className="text-foreground-subtle" />
            </div>
          )}
        </div>

        {/* seat count overlay */}
        <div className="absolute bottom-3 right-3 text-white text-right">
          <p className="text-base font-black leading-none tabular-nums drop-shadow">{c.seats}</p>
          <p className="text-[9px] opacity-80 font-medium">seats</p>
        </div>
      </div>

      {/* ── body ── */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* name */}
        <div>
          <p className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[36px]">
            {c.name}
          </p>
          <p className="text-[11px] text-foreground-subtle mt-0.5 line-clamp-1 leading-snug">
            {c.university.name}
          </p>
        </div>

        {/* state + distinction */}
        <div className="flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-foreground-muted bg-muted px-2 py-0.5 rounded-full border border-border">
            <MapPin size={8} /> {c.state}
          </span>
          {c.local_distinction && (
            <span className="text-[10px] font-semibold bg-accent-light text-accent px-2 py-0.5 rounded-full">
              {c.local_distinction}
            </span>
          )}
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-1.5 mt-auto">
          <Stat label="Seats" value={String(c.seats)} />
          <Stat label="Beds"  value={c.beds ? String(c.beds) : '—'} />
          <Stat label="Fee/yr" value={feeStr} small />
        </div>

        {/* footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border mt-1">
          <span className="text-[10px] text-foreground-subtle font-mono">#{c.id}</span>
          <span className="flex items-center gap-0.5 text-xs font-bold text-primary">
            Details <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-muted rounded-xl px-2 py-1.5 text-center overflow-hidden">
      <p className={`font-black text-foreground tabular-nums leading-tight truncate ${small ? 'text-[10px]' : 'text-xs'}`}>{value}</p>
      <p className="text-[9px] text-foreground-subtle font-medium mt-0.5">{label}</p>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="h-36 bg-skeleton" />
      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <div className="h-4 bg-skeleton rounded w-full" />
          <div className="h-3 bg-skeleton rounded w-2/3" />
        </div>
        <div className="h-5 bg-skeleton rounded-full w-20" />
        <div className="grid grid-cols-3 gap-1.5">
          {[0,1,2].map(i => <div key={i} className="h-10 bg-skeleton rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}

function SearchBox({
  value,
  onChange,
  onClear,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none z-10" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search by name…"
        className="h-10 pl-9 pr-9 w-full rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary transition-colors shadow-sm"
      />
      {value && (
        <button onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground">
          <X size={13} />
        </button>
      )}
    </div>
  );
}

function PaginationControls({
  page,
  totalPages,
  pageNums,
  onPage,
  compact = false,
}: {
  page: number;
  totalPages: number;
  pageNums: () => (number | '…')[];
  onPage: (value: number | ((page: number) => number)) => void;
  compact?: boolean;
}) {
  const navClass = compact ? 'h-8 w-[58px]' : 'h-9 w-[74px]';
  const itemClass = compact ? 'h-8 w-8' : 'h-9 w-9';

  return (
    <div className={`grid grid-cols-[auto_1fr_auto] items-center ${compact ? 'gap-1' : 'gap-2'} w-full`}>
      <button
        onClick={() => onPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
        className={`${navClass} flex items-center justify-center gap-1 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground-muted hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all`}
      >
        <ChevronLeft size={13} /> Prev
      </button>

      <div className={`flex min-w-0 items-center ${compact ? 'gap-1' : 'gap-1.5'} justify-start overflow-x-auto no-scrollbar`}>
        {pageNums().map((n, i) =>
          n === '…' ? (
            <span key={`e${i}`} className={`${itemClass} flex items-center justify-center text-foreground-subtle text-sm`}>…</span>
          ) : (
            <button
              key={n}
              onClick={() => onPage(n as number)}
              className={`${itemClass} flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                page === n
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-border bg-surface text-foreground-muted hover:bg-muted hover:text-foreground'
              }`}
            >
              {n}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className={`${navClass} flex items-center justify-center gap-1 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground-muted hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all`}
      >
        Next <ChevronRight size={13} />
      </button>
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────
function FilterPanel({ fd, state, instType, uniId, onState, onType, onUni, onClear, activeCount, children }: {
  fd: FilterData | null;
  state: string; instType: string; uniId: number | null;
  onState: (v: string) => void; onType: (v: string) => void; onUni: (v: number | null) => void;
  onClear: () => void; activeCount: number;
  children?: ReactNode;
}) {
  const [uniQ, setUniQ] = useState('');
  const unis = (fd?.universities ?? []).filter(u =>
    !uniQ || u.name.toLowerCase().includes(uniQ.toLowerCase())
  );

  return (
    <div className="space-y-5 lg:flex lg:h-full lg:flex-col">
      {/* header */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest text-foreground">Filters</p>
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-[11px] font-semibold text-error flex items-center gap-0.5 hover:opacity-80">
            <X size={10} /> Clear
          </button>
        )}
      </div>

      {/* institute type */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-2">Institute Type</p>
        <div className="space-y-1">
          {fd?.institute_types.map(t => {
            const s = ts(t);
            return (
              <button
                key={t}
                onClick={() => onType(instType === t ? '' : t)}
                className={`w-full text-left text-[11px] px-3 py-2.5 lg:py-2 rounded-xl border font-medium leading-snug transition-all flex items-center gap-2 ${
                  instType === t
                    ? 'border-primary bg-primary-light text-primary shadow-sm'
                    : 'border-border bg-background/70 lg:bg-surface text-foreground-muted hover:bg-muted hover:text-foreground'
                }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
                {shortType(t)}
              </button>
            );
          })}
        </div>
      </div>

      {/* state */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-2">State</p>
        <div className="relative">
          <select
            value={state}
            onChange={e => onState(e.target.value)}
            className="w-full h-10 lg:h-9 pl-3 pr-8 rounded-xl border border-border bg-background/70 lg:bg-surface text-xs text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
          >
            <option value="">All States</option>
            {fd?.states.filter(s => s !== 'Unclassified').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none" />
        </div>
      </div>

      {/* university */}
      {/* <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-2">University</p>
        <div className="relative mb-2">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none" />
          <input
            value={uniQ} onChange={e => setUniQ(e.target.value)}
            placeholder="Search…"
            className="w-full h-8 pl-7 pr-3 rounded-xl border border-border bg-surface text-xs placeholder:text-foreground-subtle focus:outline-none focus:border-primary"
          />
        </div>
        <div className="max-h-52 overflow-y-auto space-y-0.5" style={{ scrollbarWidth: 'thin' }}>
          <button
            onClick={() => onUni(null)}
            className={`w-full text-left text-[11px] px-3 py-1.5 rounded-lg transition-all ${
              !uniId ? 'bg-primary-light text-primary font-semibold' : 'text-foreground-muted hover:bg-muted'
            }`}
          >
            All Universities
          </button>
          {unis.slice(0, 80).map(u => (
            <button
              key={u.id}
              onClick={() => onUni(uniId === u.id ? null : u.id)}
              className={`w-full text-left text-[11px] px-3 py-1.5 rounded-lg leading-snug transition-all ${
                uniId === u.id ? 'bg-primary-light text-primary font-semibold' : 'text-foreground-muted hover:bg-muted'
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>
      </div> */}
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CollegesPage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';

  const [fd,         setFd]         = useState<FilterData | null>(null);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [pageSize,   setPageSize]   = useState(50);
  const [loading,    setLoading]    = useState(false);
  const [search,     setSearch]     = useState(initialQ);
  const [dSearch,    setDSearch]    = useState(initialQ);
  const [state,      setState]      = useState('');
  const [instType,   setInstType]   = useState('');
  const [uniId,      setUniId]      = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [paginationHidden, setPaginationHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const scrollStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // sync when URL ?q= changes (e.g. new header search while already on this page)
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setSearch(q);
    setDSearch(q);
  }, [searchParams]);

  // debounce search
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = (v: string) => {
    setSearch(v);
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => setDSearch(v), 320);
  };

  useEffect(() => {
    fetch(`${API}/institutes/filter-data`)
      .then(r => r.json())
      .then(j => setFd(j.data))
      .catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (state)   p.set('states', state);
    if (instType) p.set('institute_type', instType);
    if (uniId)   p.set('university_id', String(uniId));
    p.set('offset', String((page - 1) * pageSize));
    fetch(`${API}/institutes?${p}`)
      .then(r => r.json())
      .then(j => {
        const normalized = normalizeInstituteResponse(j);
        setInstitutes(normalized.institutes);
        setTotal(previous => normalized.total ?? previous);
        if (normalized.pageSize && normalized.pageSize > 0) setPageSize(normalized.pageSize);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [state, instType, uniId, page, pageSize]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [state, instType, uniId]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      if (scrollStopRef.current) clearTimeout(scrollStopRef.current);

      if (currentY < 24) {
        setPaginationHidden(false);
      } else if (delta > 6) {
        setPaginationHidden(true);
      } else if (delta < -6) {
        setPaginationHidden(false);
      }

      lastScrollYRef.current = currentY;
      scrollStopRef.current = setTimeout(() => setPaginationHidden(false), 260);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollStopRef.current) clearTimeout(scrollStopRef.current);
    };
  }, []);

  const activeCount = [state, instType, uniId].filter(Boolean).length;
  const clearFilters = () => { setState(''); setInstType(''); setUniId(null); };
  const clearSearch = () => { setSearch(''); setDSearch(''); };

  const displayed = dSearch.trim()
    ? institutes.filter(i => i.name.toLowerCase().includes(dSearch.toLowerCase()))
    : institutes;

  // pagination helper
  function pageNums(): (number | '…')[] {
    if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, '…', totalPages];
    if (page >= totalPages - 2) return [1, '…', totalPages - 2, totalPages - 1, totalPages];
    return [1, '…', page, '…', totalPages];
  }

  return (
    <div className="min-h-screen bg-background lg:h-screen lg:overflow-hidden">
      <div className="px-6 lg:px-8 py-6 max-w-[1500px] mx-auto pt-18 lg:h-full lg:flex lg:flex-col">

        {/* ── header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 lg:shrink-0">
          <div>
            {/* <h1 className="text-2xl font-black text-foreground tracking-tight">Medical Colleges</h1> */}
            <p className="text-sm text-foreground-muted mt-0.5">
              {loading ? 'Loading…' : `${total.toLocaleString()} institutes across India`}
            </p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <SearchBox
              value={search}
              onChange={handleSearch}
              onClear={clearSearch}
              className="flex-1 min-w-0 sm:w-60 sm:flex-none lg:hidden"
            />
            <button
              onClick={() => setFilterOpen(o => !o)}
              className={`lg:hidden shrink-0 flex items-center gap-1.5 h-10 px-4 rounded-xl border text-xs font-semibold transition-all ${
                filterOpen || activeCount > 0
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-border bg-surface text-foreground-muted hover:bg-muted'
              }`}
            >
              <SlidersHorizontal size={13} />
              Filters {activeCount > 0 && `(${activeCount})`}
            </button>
          </div>
        </div>

        {/* ── active filter chips ── */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 lg:shrink-0">
            {state && (
              <span className="flex items-center gap-1.5 text-xs font-semibold bg-primary-light text-primary px-3 py-1 rounded-full">
                <MapPin size={10} />{state}
                <button onClick={() => setState('')}><X size={10} /></button>
              </span>
            )}
            {instType && (
              <span className="flex items-center gap-1.5 text-xs font-semibold bg-secondary-light text-secondary px-3 py-1 rounded-full">
                <Building2 size={10} />{shortType(instType)}
                <button onClick={() => setInstType('')}><X size={10} /></button>
              </span>
            )}
            {uniId && fd && (
              <span className="flex items-center gap-1.5 text-xs font-semibold bg-accent-light text-accent px-3 py-1 rounded-full max-w-xs truncate">
                <GraduationCap size={10} />
                <span className="truncate">{fd.universities.find(u => u.id === uniId)?.name}</span>
                <button onClick={() => setUniId(null)} className="shrink-0"><X size={10} /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-error font-semibold hover:underline">Clear all</button>
          </div>
        )}

        <div className="flex gap-5 items-start lg:min-h-0 lg:flex-1">

          {/* ── filter sidebar ── */}
          <aside className={`fixed inset-0 z-[1300] ${filterOpen ? 'block' : 'hidden'} lg:static lg:z-auto lg:block lg:shrink-0 lg:w-80 lg:h-full`}>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setFilterOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px] lg:hidden"
            />
            <div
              className="fixed inset-x-0 bottom-0 z-[1301] max-h-[78vh] overflow-y-auto rounded-t-3xl border border-border bg-surface p-4 shadow-2xl lg:static lg:z-auto lg:h-full lg:max-h-none lg:overflow-hidden lg:rounded-2xl lg:shadow-sm lg:flex lg:flex-col"
            >
              <div className="lg:hidden mb-4 flex items-start justify-between gap-3 border-b border-border pb-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Refine results</p>
                  <h2 className="text-base font-black text-foreground">Filters</h2>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {activeCount > 0 ? `${activeCount} active filter${activeCount > 1 ? 's' : ''}` : 'Choose institute type or state'}
                  </p>
                </div>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground-muted"
                >
                  <X size={16} />
                </button>
              </div>

              <FilterPanel
                fd={fd} state={state} instType={instType} uniId={uniId}
                onState={setState} onType={setInstType} onUni={setUniId}
                onClear={clearFilters} activeCount={activeCount}
              >
                <div className="hidden lg:block border-t border-border pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-2">Search by name</p>
                  <SearchBox value={search} onChange={handleSearch} onClear={clearSearch} />
                </div>

                {!dSearch && totalPages > 1 && !loading && (
                  <div className="hidden lg:block border-t border-border pt-4 mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">Pages</p>
                      <span className="text-[11px] font-bold text-primary">{page} / {totalPages}</span>
                    </div>
                    <PaginationControls
                      page={page}
                      totalPages={totalPages}
                      pageNums={pageNums}
                      onPage={setPage}
                      compact
                    />
                  </div>
                )}

                <div className="lg:hidden sticky bottom-0 -mx-4 mt-5 border-t border-border bg-surface/95 px-4 pt-3 pb-1 backdrop-blur">
                  <div className="flex gap-2">
                    <button
                      onClick={clearFilters}
                      className="h-10 flex-1 rounded-xl border border-border bg-surface text-xs font-bold text-foreground-muted"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="h-10 flex-[1.4] rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm"
                    >
                      Apply filters
                    </button>
                  </div>
                </div>
              </FilterPanel>
            </div>
          </aside>

          {/* ── main content ── */}
          <div className="flex-1 min-w-0 pb-36 lg:h-full lg:overflow-y-auto lg:pr-1 lg:pb-0 no-scrollbar">

            {/* meta row */}
            <div className="flex items-center justify-between mb-4 min-h-[24px]">
              <p className="text-xs text-foreground-subtle">
                {dSearch
                  ? `${displayed.length} match${displayed.length !== 1 ? 'es' : ''} for "${dSearch}"`
                  : `Page ${page} of ${totalPages} · ${total.toLocaleString()} total`}
              </p>
              {loading && (
                <span className="flex items-center gap-1.5 text-xs text-foreground-subtle">
                  <Loader2 size={12} className="animate-spin text-primary" /> Loading…
                </span>
              )}
            </div>

            {/* grid */}
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Building2 size={28} className="text-foreground-subtle" />
                </div>
                <p className="text-base font-bold text-foreground mb-1">No colleges found</p>
                <p className="text-sm text-foreground-muted mb-4">Adjust your filters or search term.</p>
                <button onClick={clearFilters} className="h-9 px-5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayed.map(c => <CollegeCard key={c.id} c={c} />)}
              </div>
            )}

            {/* pagination */}
            {!dSearch && totalPages > 1 && !loading && (
              <div
                className={`fixed left-3 right-3 bottom-[92px] z-[1100] rounded-2xl border border-border bg-surface/95 p-2 shadow-2xl backdrop-blur transition-transform duration-300 ease-out lg:hidden ${
                  paginationHidden ? 'translate-y-[calc(100%+116px)] pointer-events-none' : 'translate-y-0'
                }`}
              >
                <PaginationControls
                  page={page}
                  totalPages={totalPages}
                  pageNums={pageNums}
                  onPage={setPage}
                  compact
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
