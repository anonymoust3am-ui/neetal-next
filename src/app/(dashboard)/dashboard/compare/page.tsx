'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, X, Search, BarChart2, CheckCircle2,
  AlertTriangle, Banknote, Users, Trophy,
  Home, ChevronRight, ChevronLeft, GraduationCap, MapPin,
  Star, ArrowUpRight, Loader2, RefreshCw,
} from 'lucide-react';

const INST_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const RESULTS_CAP = 60;
const LOAD_ALL_BATCH = 6;
const DEFAULT_PAGE_SIZE = 50;

/* ─── cn ─────────────────────────────────────────────────────────────── */
function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(' ');
}

interface College {
  id: number;
  name: string;
  state: string;
  type: string;
  fees: number;
  cutoff: number;
  bond: boolean;
  bondYears: number;
  bondAmt: number;
  seats: number;
  stipend: number;
  hostelFees: number;
}
type Slot = College | null;

/* map API institute → College (missing fields default to 0/false) */
function apiToCollege(i: {
  id: number; name: string; state: string; institute_type: string;
  fee?: { range?: { min?: number; max?: number } }; seats?: number;
}): College {
  return {
    id: i.id,
    name: i.name,
    state: i.state,
    type: i.institute_type,
    fees: i.fee?.range?.min ?? 0,
    cutoff: 0,
    bond: false,
    bondYears: 0,
    bondAmt: 0,
    seats: i.seats ?? 0,
    stipend: 0,
    hostelFees: 0,
  };
}

// ─── TYPE STYLE map ───────────────────────────────────────────────────────────
const TYPE_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  'INI (Institute of National Importance)': { bg: '#ccfbf1', text: '#0f766e', dot: '#0d9488' },
  'Government Institute': { bg: '#dcfce7', text: '#15803d', dot: '#16a34a' },
  'Deemed': { bg: '#ede9fe', text: '#6d28d9', dot: '#7c3aed' },
  'Private Institute (State University)': { bg: '#fef3c7', text: '#b45309', dot: '#d97706' },
  'State Private University': { bg: '#fef3c7', text: '#b45309', dot: '#d97706' },
  'State Society/PPP (State University)': { bg: '#e0f2fe', text: '#0369a1', dot: '#0ea5e9' },
  'AFMS': { bg: '#fee2e2', text: '#b91c1c', dot: '#dc2626' },
};
function ts(t: string) { return TYPE_STYLE[t] ?? { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' }; }

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmtFee(n: number) {
  if (!n) return '—';
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n.toLocaleString()}`;
}

// ─── Row definitions ──────────────────────────────────────────────────────────
interface RowDef {
  key: keyof College;
  label: string;
  icon: React.ElementType;
  accent: string;
  format: (v: unknown) => string;
  numeric?: boolean;
  lowerIsBetter?: boolean;
  special?: 'bond';
}

const ROWS: RowDef[] = [
  { key: 'state', label: 'State', icon: MapPin, accent: '#0ea5e9', format: v => String(v) },
  { key: 'type', label: 'Institute Type', icon: GraduationCap, accent: '#7c3aed', format: v => String(v) },
  { key: 'cutoff', label: 'AIQ Closing Rank', icon: Trophy, accent: '#d97706', format: v => (v as number) ? (v as number).toLocaleString('en-IN') : '—', numeric: true, lowerIsBetter: true },
  { key: 'fees', label: 'Annual Tuition Fee', icon: Banknote, accent: '#0d9488', format: v => fmtFee(v as number), numeric: true, lowerIsBetter: true },
  { key: 'bond', label: 'Bond Requirement', icon: AlertTriangle, accent: '#f59e0b', format: v => v ? 'Yes' : 'No', special: 'bond' },
  { key: 'bondYears', label: 'Bond Duration', icon: AlertTriangle, accent: '#f59e0b', format: v => v ? `${v} years` : '—', numeric: true, lowerIsBetter: true },
  { key: 'bondAmt', label: 'Bond Amount', icon: Banknote, accent: '#ef4444', format: v => v ? fmtFee(v as number) : '—', numeric: true, lowerIsBetter: true },
  { key: 'seats', label: 'MBBS Seats', icon: Users, accent: '#0d9488', format: v => String(v), numeric: true, lowerIsBetter: false },
  { key: 'stipend', label: 'Internship Stipend', icon: Banknote, accent: '#16a34a', format: v => v ? `₹${(v as number).toLocaleString('en-IN')}/mo` : 'None', numeric: true, lowerIsBetter: false },
  { key: 'hostelFees', label: 'Hostel Fee (Annual)', icon: Home, accent: '#0ea5e9', format: v => fmtFee(v as number), numeric: true, lowerIsBetter: true },
];

// ─── Shared per-cell value renderer (desktop table + mobile card) ───────────
function RowValue({ row, slot, isBest }: { row: RowDef; slot: College; isBest: boolean }) {
  const val = slot[row.key];

  if (row.special === 'bond') {
    return (
      <span className={cn(
        'inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full',
        val ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success',
      )}>
        {val ? <><AlertTriangle size={10} /> Bond Required</> : <><CheckCircle2 size={10} /> No Bond</>}
      </span>
    );
  }

  if (row.key === 'type') {
    const style = ts(String(val));
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
        style={{ background: style.bg, color: style.text }}
      >
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: style.dot }} />
        {String(val).replace(' (Institute of National Importance)', '')}
      </span>
    );
  }

  if (row.key === 'state') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
        <MapPin size={9} className="text-foreground-subtle" />
        {String(val)}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={cn('text-xs tabular-nums', isBest ? 'font-bold text-success' : 'font-semibold text-foreground')}>
        {row.format(val)}
      </span>
      {isBest && row.numeric && (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
          <Star size={8} fill="currentColor" /> Best
        </span>
      )}
    </div>
  );
}

// ─── Desktop slot header (table) ──────────────────────────────────────────────
function SlotHeader({ slot, idx, onRemove, onAdd }: {
  slot: Slot; idx: number;
  onRemove: (i: number) => void;
  onAdd: (i: number) => void;
}) {
  if (!slot) {
    return (
      <button
        onClick={() => onAdd(idx)}
        className="w-full h-full min-h-[96px] flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 text-foreground-subtle hover:text-primary transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <Plus size={16} />
        </div>
        <span className="text-xs font-semibold">Add college</span>
      </button>
    );
  }
  const style = ts(slot.type);
  return (
    <div className="flex flex-col gap-2.5 h-full">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/dashboard/colleges/${slot.id}`}
          className="text-sm font-bold text-foreground hover:text-primary transition-colors leading-snug flex-1"
        >
          {slot.name}
          <ArrowUpRight size={11} className="inline ml-0.5 opacity-50" />
        </Link>
        <button
          onClick={() => onRemove(idx)}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-foreground-subtle hover:text-error hover:bg-error/10 transition-colors shrink-0"
        >
          <X size={12} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span
          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: style.bg, color: style.text }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: style.dot }} />
          {slot.type.replace(' (Institute of National Importance)', 'INI').split(' ')[0]}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground-subtle border border-border">
          <MapPin size={8} /> {slot.state}
        </span>
      </div>
    </div>
  );
}

// ─── Mobile compare view: swipeable single-college spec sheet ───────────────
function MobileCompareView({
  slots, getBestIdx, activeIdx, setActiveIdx, onRemove, onAdd,
}: {
  slots: Slot[];
  getBestIdx: (key: keyof College, lowerIsBetter: boolean) => number;
  activeIdx: number;
  setActiveIdx: (i: number) => void;
  onRemove: (i: number) => void;
  onAdd: (i: number) => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const goTo = (i: number) => setActiveIdx(Math.max(0, Math.min(slots.length - 1, i)));

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goTo(activeIdx + 1); else goTo(activeIdx - 1);
    }
    touchStartX.current = null;
  };

  const activeSlot = slots[activeIdx];

  return (
    <div className="lg:hidden flex flex-col gap-3">
      {/* selector strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {slots.map((slot, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={idx}
              onClick={() => slot ? goTo(idx) : onAdd(idx)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 pl-3 pr-2.5 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-colors max-w-[170px]',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : slot
                    ? 'bg-card border-border text-foreground'
                    : 'bg-muted border-dashed border-border text-foreground-subtle',
              )}
            >
              {slot ? (
                <>
                  <span className="truncate">{slot.name}</span>
                  <X
                    size={11}
                    onClick={e => { e.stopPropagation(); onRemove(idx); }}
                    className={cn('shrink-0', isActive ? 'opacity-80 hover:opacity-100' : 'text-foreground-subtle hover:text-error')}
                  />
                </>
              ) : (
                <><Plus size={12} /> Add</>
              )}
            </button>
          );
        })}
      </div>

      {/* active spec card */}
      <div
        className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {!activeSlot ? (
          <button
            onClick={() => onAdd(activeIdx)}
            className="w-full flex flex-col items-center justify-center gap-2.5 py-12 text-foreground-subtle hover:text-primary transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="text-sm font-semibold">Add a college to slot {activeIdx + 1}</span>
          </button>
        ) : (
          <>
            <div className="px-4 py-4 border-b border-border flex items-start justify-between gap-2 bg-muted/40">
              <div className="min-w-0">
                <Link
                  href={`/dashboard/colleges/${activeSlot.id}`}
                  className="text-sm font-bold text-foreground hover:text-primary transition-colors leading-snug"
                >
                  {activeSlot.name}
                  <ArrowUpRight size={12} className="inline ml-0.5 opacity-50" />
                </Link>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(() => {
                    const style = ts(activeSlot.type);
                    return (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: style.bg, color: style.text }}
                      >
                        <span className="w-1 h-1 rounded-full" style={{ background: style.dot }} />
                        {activeSlot.type.replace(' (Institute of National Importance)', 'INI')}
                      </span>
                    );
                  })()}
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-card text-foreground-subtle border border-border">
                    <MapPin size={8} /> {activeSlot.state}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemove(activeIdx)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground-subtle hover:text-error hover:bg-error/10 transition-colors shrink-0"
              >
                <X size={13} />
              </button>
            </div>

            <div className="divide-y divide-border">
              {ROWS.map(row => {
                const bestIdx = row.numeric ? getBestIdx(row.key, row.lowerIsBetter ?? true) : -1;
                const isBest = activeIdx === bestIdx;
                return (
                  <div
                    key={row.key}
                    className={cn('flex items-center justify-between gap-3 px-4 py-3', isBest && 'bg-success/5')}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: row.accent + '15' }}>
                        <row.icon size={12} style={{ color: row.accent }} />
                      </div>
                      <span className="text-xs font-semibold text-foreground-muted truncate">{row.label}</span>
                    </div>
                    <div className="shrink-0">
                      <RowValue row={row} slot={activeSlot} isBest={isBest} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* prev/next + dots */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => goTo(activeIdx - 1)}
          disabled={activeIdx === 0}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-border text-foreground-muted disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <div className="flex items-center gap-1.5">
          {slots.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={cn(
                'rounded-full transition-all',
                idx === activeIdx ? 'w-5 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-border',
              )}
            />
          ))}
        </div>
        <button
          onClick={() => goTo(activeIdx + 1)}
          disabled={activeIdx === slots.length - 1}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-border text-foreground-muted disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const [slots, setSlots]       = useState<Slot[]>([null, null, null, null]);
  const [addingTo, setAddingTo] = useState<number | null>(null);
  const [search, setSearch]     = useState('');
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);

  const activeCount = slots.filter(Boolean).length;

  /* ── Institute data: paginated, accumulating list ─────────────── */
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState<number | null>(null);
  const [totalRecords, setTotalRecords] = useState<number | null>(null);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingAll, setLoadingAll]   = useState(false);
  const [loadError, setLoadError]     = useState(false);

  /* ── Filters (sourced from /institutes/filter-data) ───────────── */
  const [stateOpts, setStateOpts]   = useState<string[]>([]);
  const [typeOpts, setTypeOpts]     = useState<string[]>([]);
  const [stateFilter, setStateFilter] = useState('');
  const [typeFilter, setTypeFilter]   = useState('');
  const [filterDataLoaded, setFilterDataLoaded] = useState(false);

  const lastQueryKeyRef = useRef<string | null>(null);

  /* ── Fetch a single page of institutes (with current filters) ───
     API shape: { success, message, data: { institutes: [...] }, total, page_size }
     total / page_size are used to derive how many pages exist. ─── */
  const fetchPage = useCallback(async (pageNum: number, mode: 'replace' | 'append') => {
    const params = new URLSearchParams();
    params.set('page', String(pageNum));
    if (stateFilter) params.set('states', stateFilter);
    if (typeFilter)  params.set('institute_type', typeFilter);

    const res = await fetch(`${INST_API}/institutes?${params.toString()}`);
    const j = await res.json();

    if (j.success === false) {
      throw new Error(j.message || `Request for page ${pageNum} failed`);
    }

    const rawList = j.data?.institutes ?? (Array.isArray(j.data) ? j.data : []);
    const mapped = (rawList as Parameters<typeof apiToCollege>[0][]).map(apiToCollege);

    const total = j.total ?? j.data?.total ?? null;
    const pageSize = j.page_size ?? j.data?.page_size ?? (mapped.length || DEFAULT_PAGE_SIZE);
    const computedTotalPages = total !== null && pageSize > 0
      ? Math.max(1, Math.ceil(total / pageSize))
      : null;

    setAllColleges(prev => {
      if (mode === 'replace') return mapped;
      const keyOf = (c: College) => c.id || `${c.name}|${c.state}`;
      const seen = new Set(prev.map(keyOf));
      const fresh = mapped.filter(c => !seen.has(keyOf(c)));
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[institutes] page ${pageNum} (${mode}): received ${mapped.length}, new unique ${fresh.length}`);
      }
      return [...prev, ...fresh];
    });
    if (total !== null) setTotalRecords(total);
    if (computedTotalPages !== null) setTotalPages(computedTotalPages);
    setPage(prev => Math.max(mode === 'replace' ? pageNum : prev, pageNum));
  }, [stateFilter, typeFilter]);

  /* ── Initial / filter-change load (page 1) ─────────────────────── */
  const initLoad = useCallback(async () => {
    setLoadingPage(true);
    setLoadError(false);
    try {
      await fetchPage(1, 'replace');
    } catch {
      setLoadError(true);
    } finally {
      setLoadingPage(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    if (addingTo === null) return;
    const key = `${stateFilter}|${typeFilter}`;
    if (lastQueryKeyRef.current === key && allColleges.length > 0 && !loadError) return;
    lastQueryKeyRef.current = key;
    initLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addingTo, stateFilter, typeFilter]);

  /* ── Filter metadata (states / institute types) ────────────────── */
  useEffect(() => {
    if (addingTo === null || filterDataLoaded) return;
    fetch(`${INST_API}/institutes/filter-data`)
      .then(r => r.json())
      .then(j => {
        setStateOpts(j.data?.states ?? []);
        setTypeOpts(j.data?.institute_types ?? []);
        setFilterDataLoaded(true);
      })
      .catch(() => {});
  }, [addingTo, filterDataLoaded]);

  /* ── Load next page / load everything remaining ────────────────── */
  const loadMore = async () => {
    if (loadingPage || loadingAll || !totalPages || page >= totalPages) return;
    setLoadingPage(true);
    try {
      await fetchPage(page + 1, 'append');
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.warn('[institutes] load more failed:', err);
    } finally {
      setLoadingPage(false);
    }
  };

  const loadAllRemaining = async () => {
    if (!totalPages || page >= totalPages || loadingAll) return;
    setLoadingAll(true);
    try {
      let from = page + 1;
      while (from <= totalPages) {
        const batch = Array.from(
          { length: Math.min(LOAD_ALL_BATCH, totalPages - from + 1) },
          (_, i) => from + i,
        );
        await Promise.all(batch.map(p => fetchPage(p, 'append').catch(err => {
          if (process.env.NODE_ENV !== 'production') console.warn(`[institutes] page ${p} failed:`, err);
          return null;
        })));
        from += batch.length;
      }
    } finally {
      setLoadingAll(false);
    }
  };

  /* ── Derived search results ─────────────────────────────────────── */
  const filtered = allColleges.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) &&
      !slots.some(s => s?.id === c.id)
  );
  const visibleResults = filtered.slice(0, RESULTS_CAP);
  const allLoaded = totalPages !== null && page >= totalPages;

  function closeModal() {
    setAddingTo(null);
    setSearch('');
  }

  function addCollege(c: College) {
    if (addingTo === null) return;
    const next = [...slots];
    next[addingTo] = c;
    setSlots(next);
    setMobileActiveIdx(addingTo);
    closeModal();
  }

  function removeCollege(idx: number) {
    const next = [...slots];
    next[idx] = null;
    setSlots(next);
  }

  function getBestIdx(key: keyof College, lowerIsBetter: boolean): number {
    const vals = slots.map(s => s ? (s[key] as number) : null);
    const valid = vals.filter(v => v !== null && v !== 0) as number[];
    if (valid.length < 2) return -1;
    const best = lowerIsBetter ? Math.min(...valid) : Math.max(...valid);
    return vals.findIndex(v => v === best);
  }

  return (
    <div className="min-h-screen bg-background pb-16">

      <div className="px-4 sm:px-6 lg:px-10 max-w-[1450px] mx-auto pt-6 sm:pt-10 space-y-5">

        {/* Page title */}
        <div className="mb-3 sm:mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Compare Colleges</h1>
          <p className="text-sm sm:text-base text-foreground-muted mt-0.5">
            Compare colleges side-by-side across key parameters like fees, AIQ cutoff, bond requirements, and more.
          </p>
        </div>

        {/* ── Desktop comparison table ── */}
        <div className="hidden lg:block bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '640px' }}>

              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 z-10 bg-surface px-5 py-4 w-48 min-w-[176px] border-r border-border">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">Parameter</span>
                  </th>
                  {slots.map((slot, idx) => (
                    <th key={idx} className="px-5 py-4 text-left min-w-[200px] border-l border-border align-top">
                      <SlotHeader slot={slot} idx={idx} onRemove={removeCollege} onAdd={setAddingTo} />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {ROWS.map((row, ri) => {
                  const bestIdx = row.numeric ? getBestIdx(row.key, row.lowerIsBetter ?? true) : -1;
                  const isAltRow = ri % 2 === 1;

                  return (
                    <tr
                      key={row.key}
                      className={`border-b border-border last:border-0 transition-colors hover:bg-muted/60 ${isAltRow ? 'bg-muted/30' : ''}`}
                    >
                      <td className="sticky left-0 z-10 bg-inherit px-5 py-3.5 border-r border-border">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: row.accent + '15' }}>
                            <row.icon size={12} style={{ color: row.accent }} />
                          </div>
                          <span className="text-xs font-semibold text-foreground-muted">{row.label}</span>
                        </div>
                      </td>

                      {slots.map((slot, idx) => {
                        if (!slot) return (
                          <td key={idx} className="px-5 py-3.5 border-l border-border">
                            <span className="text-xs text-foreground-subtle">—</span>
                          </td>
                        );
                        const isBest = idx === bestIdx;
                        return (
                          <td
                            key={idx}
                            className={`px-5 py-3.5 border-l border-border transition-colors ${isBest ? 'bg-success/5' : ''}`}
                          >
                            <RowValue row={row} slot={slot} isBest={isBest} />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-border bg-muted/50 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4 text-[11px] text-foreground-subtle">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-success/10 border border-success/20 inline-block" />
                Best value in category
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 bg-warning/10 text-warning text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  <AlertTriangle size={8} /> Bond
                </span>
                Bond obligation exists
              </span>
            </div>
            <p className="text-[11px] text-foreground-subtle">Fees & seats from API · Cutoff, bond, stipend data coming soon</p>
          </div>
        </div>

        {/* ── Mobile comparison view ── */}
        <MobileCompareView
          slots={slots}
          getBestIdx={getBestIdx}
          activeIdx={mobileActiveIdx}
          setActiveIdx={setMobileActiveIdx}
          onRemove={removeCollege}
          onAdd={setAddingTo}
        />

        {/* ── empty state helper ── */}
        {activeCount === 0 && (
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-10 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BarChart2 size={24} className="text-primary" />
            </div>
            <p className="text-base font-bold text-foreground mb-1">Start comparing colleges</p>
            <p className="text-sm text-foreground-muted mb-5 max-w-xs mx-auto">
              Tap the <span className="font-bold text-primary">+ Add</span> slots above to add up to 4 colleges for a side-by-side comparison.
            </p>
            <button
              onClick={() => setAddingTo(0)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors"
              style={{ boxShadow: '0 2px 12px rgba(13,148,136,0.25)' }}
            >
              <Plus size={14} /> Add First College
            </button>
          </div>
        )}

        {/* ── quick summary cards (when ≥2 colleges selected) ── */}
        {activeCount >= 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {(() => {
              const minFeeIdx = slots.reduce<number>((best, s, i) => {
                if (!s) return best;
                const bestSlot = slots[best];
                return (!bestSlot || s.fees < bestSlot.fees) ? i : best;
              }, slots.findIndex(s => s !== null));
              const cheapest = slots[minFeeIdx];
              return cheapest ? (
                <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                    <Banknote size={16} className="text-success" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-0.5">Lowest Fees</p>
                    <p className="text-sm font-bold text-foreground truncate">{cheapest.name}</p>
                    <p className="text-lg font-black text-success">{fmtFee(cheapest.fees)}<span className="text-xs font-semibold text-foreground-subtle"> /yr</span></p>
                  </div>
                </div>
              ) : null;
            })()}

            {(() => {
              const minCutoffIdx = slots.reduce<number>((best, s, i) => {
                if (!s) return best;
                const bestSlot = slots[best];
                return (!bestSlot || s.cutoff < bestSlot.cutoff) ? i : best;
              }, slots.findIndex(s => s !== null));
              const easiest = slots[minCutoffIdx];
              return easiest ? (
                <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Trophy size={16} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-0.5">Easiest Cutoff</p>
                    <p className="text-sm font-bold text-foreground truncate">{easiest.name}</p>
                    <p className="text-lg font-black text-primary">#{easiest.cutoff.toLocaleString('en-IN')}<span className="text-xs font-semibold text-foreground-subtle"> AIR</span></p>
                  </div>
                </div>
              ) : null;
            })()}

            {(() => {
              const noBond = slots.filter(s => s && !s.bond);
              return (
                <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-success" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-0.5">Bond-Free</p>
                    {noBond.length > 0 ? (
                      <>
                        <p className="text-sm font-bold text-foreground">{noBond.length} college{noBond.length > 1 ? 's' : ''} have no bond</p>
                        <p className="text-xs text-foreground-subtle truncate">{noBond.map(s => s!.name.split(' ')[0]).join(', ')}</p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-foreground-muted">All require a bond</p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── add college modal (bottom sheet on mobile, centered on desktop) ── */}
      {addingTo !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={closeModal}
        >
          <div
            className="relative bg-surface border border-border shadow-lg w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[88vh] sm:max-h-[82vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
              <div className="w-9 h-1 rounded-full bg-border" />
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 sm:py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plus size={15} className="text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground">Add a College</p>
              </div>
              <button
                onClick={closeModal}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground-subtle hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-4 pt-4 pb-3 flex flex-col gap-2.5 shrink-0 border-b border-border">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by college name…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl pl-9 pr-3 h-10 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={stateFilter}
                  onChange={e => setStateFilter(e.target.value)}
                  className="h-9 px-2.5 text-xs rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="">All states</option>
                  {stateOpts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="h-9 px-2.5 text-xs rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="">All types</option>
                  {typeOpts.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="px-3 py-2 flex flex-col gap-1 flex-1 overflow-y-auto">
              {loadError && allColleges.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                  <AlertTriangle size={20} className="text-error" />
                  <p className="text-sm font-semibold text-foreground-muted">Couldn&apos;t load institutes</p>
                  <button
                    onClick={initLoad}
                    className="flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground-muted hover:bg-muted transition-colors"
                  >
                    <RefreshCw size={11} /> Retry
                  </button>
                </div>
              ) : loadingPage && allColleges.length === 0 ? (
                <div className="flex items-center justify-center py-10 gap-2 text-foreground-subtle">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Loading institutes…</span>
                </div>
              ) : visibleResults.length > 0 ? (
                <>
                  {visibleResults.map(c => {
                    const style = ts(c.type);
                    return (
                      <button
                        key={c.id}
                        onClick={() => addCollege(c)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted border border-transparent hover:border-border text-left transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: style.bg }}>
                          <GraduationCap size={14} style={{ color: style.text }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground leading-snug">{c.name}</p>
                          <p className="text-[10px] text-foreground-subtle mt-0.5">{c.state} · {c.fees ? `${fmtFee(c.fees)}/yr` : 'Fee N/A'}{c.cutoff ? ` · Rank ${c.cutoff.toLocaleString()}` : ''}</p>
                        </div>
                        <Plus size={13} className="text-foreground-subtle group-hover:text-primary shrink-0 transition-colors" />
                      </button>
                    );
                  })}
                  {filtered.length > RESULTS_CAP && (
                    <p className="text-center text-[11px] text-foreground-subtle py-2">
                      Showing first {RESULTS_CAP} of {filtered.length} matches — refine your search or filters to narrow it down.
                    </p>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Search size={22} className="text-foreground-subtle mb-2" />
                  <p className="text-sm font-semibold text-foreground-muted">No colleges found</p>
                  <p className="text-xs text-foreground-subtle mt-0.5">
                    {allLoaded ? 'Try a different search term or filter.' : 'Try a different search, or load more institutes below.'}
                  </p>
                </div>
              )}
            </div>

            {!loadError && (
              <div className="px-4 py-2.5 border-t border-border shrink-0 flex items-center justify-between gap-2">
                <p className="text-[11px] text-foreground-subtle">
                  {totalRecords !== null
                    ? `${allColleges.length} of ${totalRecords} loaded`
                    : `${allColleges.length} loaded`}
                </p>
                {allLoaded ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
                    <CheckCircle2 size={11} /> All institutes loaded
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={loadMore}
                      disabled={loadingPage || loadingAll}
                      className="h-7 px-2.5 rounded-lg border border-border text-[11px] font-semibold text-foreground-muted hover:bg-muted disabled:opacity-50 transition-colors"
                    >
                      Load more
                    </button>
                    <button
                      onClick={loadAllRemaining}
                      disabled={loadingPage || loadingAll}
                      className="h-7 px-2.5 rounded-lg bg-primary text-white text-[11px] font-semibold hover:bg-primary-hover disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      {loadingAll && <Loader2 size={10} className="animate-spin" />}
                      Load all
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}