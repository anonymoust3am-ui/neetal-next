'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Info,
  Loader2,
  Search,
  X,
} from 'lucide-react';

interface Header {
  name: string;
  key: string;
  sortable?: boolean;
  hyperlink?: boolean;
  use_short_name?: boolean;
}

interface AllotmentData {
  success: boolean;
  message?: string;
  data: {
    selected_session: string;
    headers: Header[];
    records: any[];
    access_state: string;
    total: number;
    page_size: number;
    show_rank_switch: boolean;
    remarks_content: string;
    remarks: { type: string; html: string };
    table_comments: string[];
    is_group: boolean;
    candidate_flags: Record<string, { color: string; label: string }>;
  };
}

const PAGE_SIZE = 50;
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Chandigarh', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

const SESSION_OPTIONS = ['2025', '2024', '2023', '2022'];
const ROUND_OPTIONS = ['1', '2', '3', '4', 'Stray', 'Mop Up'];

function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(' ');
}

function getAllotmentCellValue(row: Record<string, any>, header: Header) {
  const label = `${header.key} ${header.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  if (label.includes('ai_rank')) return row.ai_rank;
  return row[header.key];
}

type PaginationItem = number | 'ellipsis';

function paginationItems(page: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 12) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const midpoint = Math.max(1, Math.floor(totalPages / 2));
  const anchors = [
    1,
    2,
    3,
    page - 5,
    page,
    page + 5,
    midpoint,
    midpoint + 5,
    Math.floor(totalPages * 0.6),
    totalPages - 20,
    totalPages - 5,
    totalPages,
  ]
    .map(n => Math.max(1, Math.min(totalPages, n)))
    .filter((n, index, arr) => arr.indexOf(n) === index)
    .sort((a, b) => a - b);

  return anchors.reduce<PaginationItem[]>((items, n) => {
    const prev = items[items.length - 1];
    if (typeof prev === 'number') {
      const gap = n - prev;
      if (gap === 2) items.push(prev + 1);
      if (gap > 2) items.push('ellipsis');
    }
    items.push(n);
    return items;
  }, []);
}

export default function ResourcesPage() {
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');

  const [session, setSession] = useState('');
  const [rounds, setRounds] = useState('');
  const [states, setStates] = useState('');
  const [counsellingLevel, setCounsellingLevel] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    session: '',
    rounds: '',
    states: '',
    counsellingLevel: '',
  });

  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [headers, setHeaders] = useState<Header[]>([]);
  const [total, setTotal] = useState(0);
  const [candidateFlags, setCandidateFlags] = useState<Record<string, any>>({});
  const [remarksHtml, setRemarksHtml] = useState('');
  const [showRemarks, setShowRemarks] = useState(false);
  const [error, setError] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(PAGE_SIZE),
      });

      if (appliedFilters.session) params.set('session', appliedFilters.session);
      if (appliedFilters.rounds) params.set('rounds', appliedFilters.rounds);
      if (appliedFilters.states) params.set('states', appliedFilters.states);
      if (appliedFilters.counsellingLevel) params.set('counselling_level', appliedFilters.counsellingLevel);

      const res = await fetch(`${API}/allotment?${params.toString()}`);
      const json = (await res.json()) as AllotmentData;

      if (!json.success) {
        setError(json.message || 'Failed to load allotment data');
        return;
      }

      setHeaders(json.data.headers ?? []);
      setRecords(json.data.records ?? []);
      setTotal(json.data.total ?? 0);
      setCandidateFlags(json.data.candidate_flags || {});
      setRemarksHtml(json.data.remarks?.html || '');
    } catch (err) {
      setError((err as Error).message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [page, appliedFilters, API]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startRecord = total > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const endRecord = total > 0 ? Math.min(currentPage * PAGE_SIZE, total) : 0;
  const pages = paginationItems(currentPage, totalPages);
  const activeFilterCount = [session, rounds, states, counsellingLevel].filter(Boolean).length;
  const tableColCount = Math.max(headers.length, 6);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handleClearFilters = () => {
    setSession('');
    setRounds('');
    setStates('');
    setCounsellingLevel('');
    setAppliedFilters({ session: '', rounds: '', states: '', counsellingLevel: '' });
    setPage(1);
  };

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  const applyFilters = () => {
    setAppliedFilters({ session, rounds, states, counsellingLevel });
    setPage(1);
  };

  const submitPageInput = () => {
    const nextPage = Number(pageInput);
    if (!Number.isFinite(nextPage)) {
      setPageInput(String(currentPage));
      return;
    }
    setPage(Math.max(1, Math.min(totalPages, Math.trunc(nextPage))));
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6 max-w-[1600px] mx-auto">
        {/* Header */}
        {/* <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              <Search size={12} />
              Historical allotment explorer
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Allotment Records</h1>
            <p className="mt-1 max-w-2xl text-sm text-foreground-muted">
              Browse NEET allotment rows with session, round, state, counselling level, and full-width pagination.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface p-2 text-center shadow-sm sm:w-[360px]">
            <div className="rounded-xl bg-muted px-2 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-subtle">Records</p>
              <p className="mt-0.5 text-sm font-black text-foreground">{total.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-muted px-2 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-subtle">Page</p>
              <p className="mt-0.5 text-sm font-black text-foreground">{currentPage}/{totalPages}</p>
            </div>
            <div className="rounded-xl bg-muted px-2 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-subtle">Filters</p>
              <p className="mt-0.5 text-sm font-black text-foreground">{activeFilterCount}</p>
            </div>
          </div>
        </div> */}

        {/* Filter Bar */}
        <div className="mb-5 rounded-2xl border border-border bg-surface p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Filter size={15} />
              </div>
              <div>
                <p className="text-sm font-black text-foreground">Filters</p>
                <p className="text-[11px] text-foreground-subtle">State is now selected from a fixed list.</p>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-bold text-foreground-muted transition-colors hover:bg-muted"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[140px_150px_220px_160px_auto] xl:items-end">
          <label>
            <span className="block text-xs font-semibold text-foreground-subtle uppercase tracking-wide mb-1">
              Session
            </span>
            <select
              value={session}
              onChange={e => updateFilter(setSession, e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-border-focus focus:bg-surface"
            >
              <option value="">All sessions</option>
              {SESSION_OPTIONS.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>

          <label>
            <span className="block text-xs font-semibold text-foreground-subtle uppercase tracking-wide mb-1">
              Rounds
            </span>
            <select
              value={rounds}
              onChange={e => updateFilter(setRounds, e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-border-focus focus:bg-surface"
            >
              <option value="">All rounds</option>
              {ROUND_OPTIONS.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>

          <label>
            <span className="block text-xs font-semibold text-foreground-subtle uppercase tracking-wide mb-1">
              State
            </span>
            <select
              value={states}
              onChange={e => updateFilter(setStates, e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-border-focus focus:bg-surface"
            >
              <option value="">All states</option>
              {INDIAN_STATES.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>

          <label>
            <span className="block text-xs font-semibold text-foreground-subtle uppercase tracking-wide mb-1">
              Counselling
            </span>
            <select
              value={counsellingLevel}
              onChange={e => updateFilter(setCounsellingLevel, e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-border-focus focus:bg-surface"
            >
              <option value="">All</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
            </select>
          </label>

          <button
            onClick={applyFilters}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-error-light border border-red-200 rounded-2xl text-error text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-4 py-3">
            <div>
              <p className="text-sm font-black text-foreground">Allotment table</p>
              <p className="text-[11px] text-foreground-subtle">
                Showing {startRecord} to {endRecord}
              </p>
            </div>
            {loading && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                <Loader2 size={11} className="animate-spin" /> Loading
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: 980 }}>
            <thead>
              <tr className="bg-surface border-b border-border">
                {headers.length > 0 ? headers.map(h => (
                  <th
                    key={h.key}
                    className="text-left px-4 py-3 text-[11px] font-black text-foreground-subtle uppercase tracking-wider whitespace-nowrap"
                  >
                    {h.name}
                  </th>
                )) : Array.from({ length: tableColCount }).map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-foreground-subtle">
                    {i === 0 ? 'Loading' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows cols={tableColCount} />
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={tableColCount} className="px-4 py-12 text-center text-foreground-muted">
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((row, i) => (
                  <tr
                    key={row.id || i}
                    className={`hover:bg-hover transition-colors ${i < records.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    {headers.map(h => (
                      <td key={h.key} className="px-4 py-3.5 text-foreground-muted">
                        <CellValue header={h} value={getAllotmentCellValue(row, h)} candidateFlags={candidateFlags} />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="mb-6 rounded-2xl border border-border bg-surface p-3 shadow-sm">
            <div className="mb-3 grid grid-cols-3 items-center gap-2">
              <p className="text-left text-xs font-bold text-foreground-muted">
                {startRecord}-{endRecord}
              </p>
              <p className="text-center text-xs font-black text-foreground">
                Page {currentPage} / {totalPages}
              </p>
              <p className="text-right text-xs font-bold text-foreground-muted">
                {total.toLocaleString()} records
              </p>
            </div>

            <div className="flex w-full items-center justify-between gap-1.5 overflow-x-auto rounded-2xl border border-border bg-muted/40 p-2">
              {pages.map((item, index) => item === 'ellipsis' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 min-w-8 flex-1 items-center justify-center rounded-lg text-sm font-black text-foreground-subtle"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  disabled={item === currentPage}
                  className={cn(
                    'h-9 min-w-10 flex-1 rounded-lg px-2 text-xs font-black transition-colors disabled:cursor-default',
                    item === currentPage
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-border bg-surface text-foreground-muted hover:bg-hover hover:text-foreground',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-[1fr_minmax(150px,220px)_1fr] gap-2">
              <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface text-xs font-bold text-foreground-muted transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={13} /> Previous
              </button>

              <div className="flex h-10 items-center rounded-xl border border-border bg-surface p-1">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInput}
                  onChange={e => setPageInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') submitPageInput();
                  }}
                  className="h-full min-w-0 flex-1 bg-transparent px-2 text-center text-sm font-black text-foreground outline-none"
                  aria-label="Enter page number"
                />
                <button
                  onClick={submitPageInput}
                  className="h-full rounded-lg bg-primary px-3 text-xs font-black text-white transition-colors hover:bg-primary-hover"
                >
                  Go
                </button>
              </div>

              <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface text-xs font-bold text-foreground-muted transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Remarks */}
        {remarksHtml && (
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setShowRemarks(!showRemarks)}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors text-left"
            >
              <Info size={18} className="text-primary flex-shrink-0" />
              <span className="font-semibold text-foreground flex-1">Details & Remarks</span>
              <span className="text-foreground-subtle text-sm">{showRemarks ? '−' : '+'}</span>
            </button>

            {showRemarks && (
              <div
                className="px-4 pb-4 border-t border-border text-sm text-foreground-muted prose prose-sm"
                dangerouslySetInnerHTML={{ __html: remarksHtml }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CellValue({
  header,
  value,
  candidateFlags,
}: {
  header: Header;
  value: any;
  candidateFlags: Record<string, any>;
}) {
  if (value === null || value === undefined) {
    return <span className="text-foreground-subtle">—</span>;
  }

  if (typeof value === 'boolean') {
    if (!value) {
      return <span className="text-foreground-subtle">—</span>;
    }
    const flag = candidateFlags?.[header.key];
    const bgColor = `bg-${flag?.color || 'blue'}-100`;
    const textColor = `text-${flag?.color || 'blue'}-700`;
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bgColor} ${textColor}`}>
        {flag?.label || 'Yes'}
      </span>
    );
  }

  if (typeof value === 'object' && value !== null) {
    if (header.use_short_name && value.short_name) {
      return <span>{value.short_name}</span>;
    }
    return <span>{value.short_name || value.name || '—'}</span>;
  }

  return <span>{String(value)}</span>;
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <tr key={i} className="border-b border-border animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-skeleton rounded w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
