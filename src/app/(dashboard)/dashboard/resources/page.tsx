'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

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

export default function ResourcesPage() {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  const [session, setSession] = useState('');
  const [rounds, setRounds] = useState('');
  const [states, setStates] = useState('');
  const [counsellingLevel, setCounsellingLevel] = useState('');

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

      if (session) params.set('session', session);
      if (rounds) params.set('rounds', rounds);
      if (states) params.set('states', states);
      if (counsellingLevel) params.set('counselling_level', counsellingLevel);

      const res = await fetch(`${API}/allotment?${params.toString()}`);
      const json = (await res.json()) as AllotmentData;

      if (!json.success) {
        setError(json.message || 'Failed to load allotment data');
        return;
      }

      setHeaders(json.data.headers);
      setRecords(json.data.records);
      setTotal(json.data.total);
      setCandidateFlags(json.data.candidate_flags || {});
      setRemarksHtml(json.data.remarks?.html || '');
    } catch (err) {
      setError((err as Error).message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [page, session, rounds, states, counsellingLevel, API]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setPage(1);
  }, [session, rounds, states, counsellingLevel]);

  const handleClearFilters = () => {
    setSession('');
    setRounds('');
    setStates('');
    setCounsellingLevel('');
    setPage(1);
  };

  const pageNums = (): (number | string)[] => {
    const total_pages = Math.ceil(total / PAGE_SIZE);
    if (total_pages <= 7) return Array.from({ length: total_pages }, (_, i) => i + 1);

    const pages: (number | string)[] = [1];
    if (page > 3) pages.push('…');

    const start = Math.max(2, page - 1);
    const end = Math.min(total_pages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (page < total_pages - 2) pages.push('…');
    pages.push(total_pages);

    return pages;
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="px-6 lg:px-8 py-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Allotment Records</h1>
          <p className="text-foreground-muted">Browse historical NEET allotment data with filters and pagination.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-end gap-3 mb-6 p-4 bg-surface border border-border rounded-2xl">
          <div>
            <label className="block text-xs font-semibold text-foreground-subtle uppercase tracking-wide mb-1">
              Session
            </label>
            <input
              type="number"
              value={session}
              onChange={e => setSession(e.target.value)}
              placeholder="e.g. 2025"
              className="h-9 px-3 text-sm rounded-lg outline-none bg-muted border border-border text-foreground placeholder:text-foreground-subtle focus:border-border-focus focus:bg-surface transition-colors w-28"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground-subtle uppercase tracking-wide mb-1">
              Rounds
            </label>
            <input
              type="text"
              value={rounds}
              onChange={e => setRounds(e.target.value)}
              placeholder="e.g. 1,2,3"
              className="h-9 px-3 text-sm rounded-lg outline-none bg-muted border border-border text-foreground placeholder:text-foreground-subtle focus:border-border-focus focus:bg-surface transition-colors w-32"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground-subtle uppercase tracking-wide mb-1">
              States
            </label>
            <input
              type="text"
              value={states}
              onChange={e => setStates(e.target.value)}
              placeholder="e.g. Delhi,Karnataka"
              className="h-9 px-3 text-sm rounded-lg outline-none bg-muted border border-border text-foreground placeholder:text-foreground-subtle focus:border-border-focus focus:bg-surface transition-colors w-40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground-subtle uppercase tracking-wide mb-1">
              Counselling
            </label>
            <select
              value={counsellingLevel}
              onChange={e => setCounsellingLevel(e.target.value)}
              className="h-9 px-3 text-sm rounded-lg outline-none bg-muted border border-border text-foreground focus:border-border-focus focus:bg-surface transition-colors w-32"
            >
              <option value="">All</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
            </select>
          </div>

          <button
            onClick={handleClearFilters}
            className="h-9 px-4 rounded-lg border border-border text-xs font-semibold text-foreground-muted hover:bg-muted transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-error-light border border-red-200 rounded-2xl text-error text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-surface border border-border rounded-2xl overflow-x-auto shadow-sm mb-6">
          <table className="w-full text-sm border-collapse" style={{ minWidth: 900 }}>
            <thead>
              <tr className="bg-muted border-b border-border">
                {headers.map(h => (
                  <th
                    key={h.key}
                    className="text-left px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide whitespace-nowrap"
                  >
                    {h.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows cols={headers.length} />
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="px-4 py-12 text-center text-foreground-muted">
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
                      <td key={h.key} className="px-4 py-3 text-foreground-muted">
                        <CellValue header={h} value={row[h.key]} candidateFlags={candidateFlags} />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <p className="text-sm text-foreground-muted">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} records
            </p>

            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 h-9 px-3.5 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground-muted hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={13} /> Prev
              </button>

              {pageNums().map((n, i) =>
                n === '…' ? (
                  <span key={`ellipsis-${i}`} className="w-9 text-center text-foreground-subtle text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(Number(n))}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      page === n
                        ? 'bg-primary text-white shadow-sm'
                        : 'border border-border bg-surface text-foreground-muted hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {n}
                  </button>
                )
              )}

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / PAGE_SIZE)}
                className="flex items-center gap-1 h-9 px-3.5 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground-muted hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
