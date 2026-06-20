'use client';

import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, Check, X, SlidersHorizontal,
  GripVertical, ListChecks, FolderOpen, ChevronRight, ChevronLeft,
  ChevronUp, ChevronDown, Loader2,
} from 'lucide-react';
import { HEADER_H } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  getCounsellingOptions,
  getChoiceLists,
  getChoiceList,
  createChoiceList,
  updateChoiceList,
  deleteChoiceList,
  addChoiceListDetail,
  deleteChoiceListDetail,
  reorderChoiceListDetails,
} from '@/lib/api';
import type { ChoiceListSummary, ChoiceListDetail } from '@/lib/api';

const INST_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/* ─── cn ─────────────────────────────────────────────────────────────── */
function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(' ');
}

/* ─── Column definitions ─────────────────────────────────────────────── */
const DATA_COLS: Array<{ key: keyof ChoiceListDetail | string; label: string; w: number }> = [
  { key: 'course', label: 'Course', w: 80 },
  { key: 'quota', label: 'Quota', w: 40 },
  { key: 'catagory', label: 'Category', w: 40 },
];

const CR_YEAR_ROUNDS: Array<[string, number]> = [
  ['2022', 6], ['2023', 6], ['2024', 7], ['2025', 6],
];
const LATEST_YEAR = CR_YEAR_ROUNDS[CR_YEAR_ROUNDS.length - 1][0];
const LATEST_ROUNDS = CR_YEAR_ROUNDS[CR_YEAR_ROUNDS.length - 1][1];

/* ─── Hardcoded filter options (quota / category for filter chips) ───── */
const QUOTA_OPTS = ['AIQ', 'State Quota', 'NRI', 'Institutional', 'Management', 'PwD'];
const CATEGORY_OPTS = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS', 'PwD-General', 'PwD-OBC', 'PwD-SC', 'PwD-ST', 'PwD-EWS'];

/* ─── Types ──────────────────────────────────────────────────────────── */
interface FilterState {
  quotas: string[];
  categories: string[];
}

type InsertAt = 'top' | 'bottom' | 'custom';
type MobilePanel = 'lists' | 'detail';

/* ─── Shared input styles ────────────────────────────────────────────── */
const inputCls =
  'h-10 px-3 text-sm w-full rounded-lg outline-none ' +
  'bg-muted border border-border text-foreground placeholder:text-foreground-subtle ' +
  'focus:border-border-focus focus:bg-card transition-colors';

const selectCls = inputCls + ' appearance-none cursor-pointer';

/* ─── Modal wrapper (bottom sheet on mobile, centered on desktop) ────── */
function Modal({ title, children, onClose, width = 'sm:max-w-md' }: {
  title: string; children: React.ReactNode; onClose: () => void; width?: string;
}) {
  return (
    <div className="fixed inset-0 z-modal-backdrop flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-overlay/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative z-modal w-full bg-card border border-border shadow-lg flex flex-col',
          'rounded-t-2xl sm:rounded-2xl',
          'max-h-[88vh] sm:max-h-[85vh]',
          'mb-16 sm:mb-0',
          width,
        )}
      >
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
          <div className="w-9 h-1 rounded-full bg-border" />
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 sm:py-4 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              hover:bg-hover text-foreground-subtle hover:text-foreground transition-colors"
          >
            <X size={15} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children, required }: {
  label: string; children: React.ReactNode; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-foreground-muted">
        {label}{required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ModalError({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-error-light text-error text-xs font-medium">
      {msg}
    </div>
  );
}

/* ─── Create List Modal ──────────────────────────────────────────────── */
function CreateListModal({ counsellingOpts, onClose, onCreate }: {
  counsellingOpts: string[];
  onClose: () => void;
  onCreate: (name: string, caunselling: string) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [caunselling, setCaunselling] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) { setErr('List name is required'); return; }
    if (!caunselling) { setErr('Please select a counselling type'); return; }
    setSaving(true);
    try {
      await onCreate(name.trim(), caunselling);
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed to create list');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Create new choice list" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {err && <ModalError msg={err} />}

        <FormField label="Counselling type" required>
          <select
            value={caunselling}
            onChange={e => { setCaunselling(e.target.value); setErr(''); }}
            className={selectCls}
          >
            <option value="">Select counselling…</option>
            {counsellingOpts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </FormField>

        <FormField label="List name" required>
          <input
            autoFocus
            value={name}
            onChange={e => { setName(e.target.value); setErr(''); }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="e.g. AIQ Round 1 — Main List"
            className={inputCls}
          />
        </FormField>

        <div className="flex gap-2 pt-1">
          <button
            onClick={submit}
            disabled={saving}
            className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg
              text-sm font-semibold hover:bg-primary-hover transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            Create list
          </button>
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-lg border border-border text-sm font-medium
              text-foreground-muted hover:bg-hover transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Add Choice Modal ───────────────────────────────────────────────── */
function AddChoiceModal({ defaultCaunselling, choiceCount, counsellingOpts, onClose, onAdd }: {
  defaultCaunselling: string;
  choiceCount: number;
  counsellingOpts: string[];
  onClose: () => void;
  onAdd: (entry: { caunselling: string; institute: string; course: string; quota: string; category: string }, insertAt: 'top' | 'bottom' | number) => Promise<void>;
}) {
  const [caunselling, setCaunselling] = useState(defaultCaunselling);
  const [quota, setQuota] = useState('');
  const [category, setCategory] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  /* institute select */
  const [allInsts, setAllInsts] = useState<{ id: number; name: string; state: string }[]>([]);
  const [selectedInstId, setSelectedInstId] = useState<number | null>(null);
  const [instDropOpen, setInstDropOpen] = useState(false);
  const [loadingInsts, setLoadingInsts] = useState(true);

  /* course dropdown */
  const [courses, setCourses] = useState<string[]>([]);
  const [course, setCourse] = useState('');
  const [loadingCourses, setLoadingCourses] = useState(false);

  /* load institutes on mount and when counselling changes */
  useEffect(() => {
    if (!caunselling) {
      setAllInsts([]);
      setSelectedInstId(null);
      setLoadingInsts(false);
      return;
    }

    const controller = new AbortController();

    // Immediately show loading state
    setLoadingInsts(true);

    // Clear previous data
    setAllInsts([]);
    setSelectedInstId(null);
    setCourses([]);
    setCourse('');

    const loadInstitutes = async () => {
      try {
        const params = new URLSearchParams();
        params.set('page', '1');
        params.set('counselling', caunselling);

        const response = await fetch(
          `${INST_API}/institutes?${params.toString()}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch institutes');
        }

        const json = await response.json();

        // Ignore if request was aborted
        if (controller.signal.aborted) return;

        setAllInsts(
          (json.data?.institutes ?? []).map(
            (i: { id: number; name: string; state: string }) => ({
              id: i.id,
              name: i.name,
              state: i.state,
            })
          )
        );
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          err.name !== 'AbortError'
        ) {
          console.error('Institute fetch failed:', err);
          setAllInsts([]);
        }
      } finally {
        // Don't update loading state for aborted requests
        if (!controller.signal.aborted) {
          setLoadingInsts(false);
        }
      }
    };

    loadInstitutes();

    return () => {
      controller.abort();
    };
  }, [caunselling]);

  /* load courses when institute is selected */
  useEffect(() => {
    if (!selectedInstId) { setCourses([]); return; }
    setLoadingCourses(true);
    fetch(`${INST_API}/institutes/${selectedInstId}`)
      .then(r => r.json())
      .then(j => {
        const raw = j.data?.general_information?.courses ?? [];
        setCourses(
          (raw as (string | { name?: string; short_name?: string })[])
            .map(c => typeof c === 'string' ? c : (c.name ?? c.short_name ?? ''))
            .filter(Boolean)
        );
      })
      .catch(() => setCourses([]))
      .finally(() => setLoadingCourses(false));
  }, [selectedInstId]);

  const selectedInst = allInsts.find(i => i.id === selectedInstId);

  const submit = async () => {
    const instituteName = selectedInst?.name ?? '';
    if (!instituteName) { setErr('Institute is required'); return; }
    if (!course.trim()) { setErr('Course is required'); return; }
    if (!quota) { setErr('Please select quota'); return; }
    if (!category) { setErr('Please select category'); return; }

    setSaving(true);
    try {
      await onAdd({ caunselling, institute: instituteName, course: course.trim(), quota, category }, 'bottom');
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed to add choice');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Add to Choice List" onClose={onClose} width="sm:max-w-lg">
      <div className="flex flex-col gap-3.5">
        {err && <ModalError msg={err} />}

        <FormField label="Counselling">
          <select
            value={caunselling}
            onChange={e => { setCaunselling(e.target.value); setSelectedInstId(null); setCourses([]); setCourse(''); setErr(''); }}
            className={selectCls}
          >
            {counsellingOpts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </FormField>

        <FormField label="Institute" required>
          <div className="relative">
            <button
              type="button"
              onClick={() => setInstDropOpen(!instDropOpen)}
              disabled={loadingInsts}
              className={cn(
                selectCls,
                'flex items-center justify-between text-left',
                loadingInsts && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className={selectedInstId ? 'text-foreground' : 'text-foreground-subtle'}>
                {loadingInsts ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" />
                    Loading institutes…
                  </span>
                ) : (selectedInst?.name ?? 'Select institute…')}
              </span>
              <ChevronDown size={14} className={cn('shrink-0 transition-transform', instDropOpen && 'rotate-180')} />
            </button>
            {instDropOpen && !loadingInsts && allInsts.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {allInsts.map(inst => (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => {
                      setSelectedInstId(inst.id);
                      setInstDropOpen(false);
                      setCourse('');
                      setErr('');
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors border-b border-border last:border-b-0',
                      selectedInstId === inst.id ? 'bg-primary-light' : 'hover:bg-muted'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{inst.name}</p>
                      <p className="text-[10px] text-foreground-muted mt-0.5">{inst.state}</p>
                    </div>
                    {selectedInstId === inst.id && <Check size={14} className="text-primary shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormField>

        <FormField label="Course" required>
          {loadingCourses ? (
            <div className={cn(inputCls, 'flex items-center gap-2 text-foreground-subtle')}>
              <Loader2 size={12} className="animate-spin" /> Loading courses…
            </div>
          ) : courses.length > 0 ? (
            <select value={course} onChange={e => { setCourse(e.target.value); setErr(''); }} className={selectCls}>
              <option value="">Select course…</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          ) : (
            <input
              value={course}
              onChange={e => { setCourse(e.target.value); setErr(''); }}
              placeholder="e.g. MBBS"
              className={inputCls}
            />
          )}
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Quota" required>
            <select value={quota} onChange={e => { setQuota(e.target.value); setErr(''); }} className={selectCls}>
              <option value="">Select quota…</option>
              {QUOTA_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FormField>
          <FormField label="Category" required>
            <select value={category} onChange={e => { setCategory(e.target.value); setErr(''); }} className={selectCls}>
              <option value="">Select category…</option>
              {CATEGORY_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FormField>
        </div>

        <div className="flex gap-2 pt-1 border-t border-border">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-lg border border-border text-sm font-medium text-foreground-muted hover:bg-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            Add to Choice List
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Filter Modal ───────────────────────────────────────────────────── */
function FilterModal({ filter, onApply, onClose }: {
  filter: FilterState;
  onApply: (f: FilterState) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<FilterState>(filter);

  const toggle = (key: keyof FilterState, val: string) =>
    setLocal(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }));

  const activeCount = local.quotas.length + local.categories.length;

  function Group({ title, opts, fKey }: { title: string; opts: string[]; fKey: keyof FilterState }) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground-subtle mb-2">{title}</p>
        <div className="flex flex-wrap gap-1.5">
          {opts.map(opt => {
            const active = local[fKey].includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(fKey, opt)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-foreground-muted border-border hover:border-primary/40 hover:text-primary',
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Modal title="Filter choices" onClose={onClose} width="sm:max-w-sm">
      <div className="flex flex-col gap-4">
        <Group title="Quota" opts={QUOTA_OPTS} fKey="quotas" />
        <Group title="Category" opts={CATEGORY_OPTS} fKey="categories" />

        <div className="flex gap-2 pt-2 border-t border-border">
          <button
            onClick={() => setLocal({ quotas: [], categories: [] })}
            className="h-10 px-4 rounded-lg border border-border text-sm font-medium
              text-foreground-muted hover:bg-hover transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={() => { onApply(local); onClose(); }}
            className="flex-1 h-10 bg-primary text-primary-foreground rounded-lg
              text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Apply{activeCount > 0 ? ` (${activeCount})` : ''}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Choice card (mobile / tablet) ──────────────────────────────────── */
function ChoiceCard({ detail, idx, total, canReorder, onRemove, onMove }: {
  detail: ChoiceListDetail;
  idx: number;
  total: number;
  canReorder: boolean;
  onRemove: (id: string) => void;
  onMove: (idx: number, dir: -1 | 1) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const latestRanks = Array.from({ length: LATEST_ROUNDS }, (_, i) => {
    const numKey = String(i + 1);
    const roundKey = `R${i + 1}`;
    return detail.closingRanks?.[LATEST_YEAR]?.[numKey] ?? detail.closingRanks?.[LATEST_YEAR]?.[roundKey];
  }).filter(Boolean);

  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex items-start gap-2.5">
        <span className={cn(
          'shrink-0 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold',
          idx < 3 ? 'bg-primary-light text-primary' : 'bg-muted text-foreground-muted',
        )}>
          {idx + 1}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">{detail.institute}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span className="px-1.5 py-0.5 rounded-md bg-muted text-foreground-muted text-xs font-medium">{detail.course || '—'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-muted text-foreground-muted text-xs font-medium">{detail.quota || '—'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-muted text-foreground-muted text-xs font-medium">{detail.catagory || '—'}</span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          {canReorder && (
            <div className="flex flex-col">
              <button
                onClick={() => onMove(idx, -1)}
                disabled={idx === 0}
                className="w-6 h-5 flex items-center justify-center text-foreground-subtle disabled:opacity-20 hover:text-primary transition-colors"
              >
                <ChevronUp size={12} />
              </button>
              <button
                onClick={() => onMove(idx, 1)}
                disabled={idx === total - 1}
                className="w-6 h-5 flex items-center justify-center text-foreground-subtle disabled:opacity-20 hover:text-primary transition-colors"
              >
                <ChevronDown size={12} />
              </button>
            </div>
          )}
          <button
            onClick={() => onRemove(detail.id)}
            className="w-7 h-7 flex items-center justify-center rounded-md text-foreground-subtle hover:text-error hover:bg-error-light transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* <button
        onClick={() => setExpanded(e => !e)}
        className="mt-2.5 w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-muted text-xs font-medium text-foreground-muted hover:bg-hover transition-colors"
      >
        <span>{LATEST_YEAR} ranks: {latestRanks.length ? latestRanks.join(', ') : '—'}</span>
        <ChevronRight size={12} className={cn('transition-transform shrink-0 ml-2', expanded && 'rotate-90')} />
      </button>

       {expanded && (
        <div className="mt-2 flex flex-col gap-2">
          {CR_YEAR_ROUNDS.map(([year, rounds]) => (
            <div key={year}>
              <p className="text-xs font-semibold text-foreground-subtle mb-1">{year}</p>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: rounds }, (_, i) => {
                  const numKey = String(i + 1);
                  const roundKey = `R${i + 1}`;
                  const cr = detail.closingRanks?.[year]?.[numKey] ?? detail.closingRanks?.[year]?.[roundKey];
                  return (
                    <span
                      key={`${year}_${i}`}
                      className={cn(
                        'px-1.5 py-0.5 rounded-md text-xs font-medium',
                        cr ? 'bg-primary-light text-primary' : 'bg-muted text-foreground-subtle/40',
                      )}
                    >
                      R{i + 1}: {cr ?? '—'}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function ChoiceListPage() {
  const { firebaseUser } = useAuth();

  const [lists, setLists] = useState<ChoiceListSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [details, setDetails] = useState<ChoiceListDetail[]>([]);
  const [counsellingOpts, setCounsellingOpts] = useState<string[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  /* mobile master/detail navigation */
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('lists');

  /* sidebar inline interactions */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  /* modals */
  const [showCreate, setShowCreate] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  /* filter */
  const [filter, setFilter] = useState<FilterState>({ quotas: [], categories: [] });

  /* drag (desktop table) */
  const dragSrcIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  /* ── Token helper ─────────────────────────────────────────────── */
  const getToken = useCallback(async (): Promise<string> => {
    if (!firebaseUser) throw new Error('Not authenticated');
    return firebaseUser.getIdToken();
  }, [firebaseUser]);

  /* ── Load lists ───────────────────────────────────────────────── */
  const fetchLists = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await getChoiceLists(token, { limit: 50 });
      setLists(res.choiceLists);
      if (res.choiceLists.length > 0 && !activeId) {
        setActiveId(res.choiceLists[0].id);
      }
    } catch {
      setLists([]);
    } finally {
      setLoadingLists(false);
    }
  }, [getToken, activeId]);

  /* ── Load counselling body names for dropdowns ────────────────── */
  useEffect(() => {
    getCounsellingOptions()
      .then(opts => {
        const names = opts.flatMap(o => o.bodies.map(b => b.name));
        setCounsellingOpts(names);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (firebaseUser) fetchLists();
  }, [firebaseUser]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Load details when activeId changes ──────────────────────── */
  const fetchDetails = useCallback(async (id: string) => {
    setLoadingDetails(true);
    try {
      const token = await getToken();
      const full = await getChoiceList(token, id);
      setDetails(full.details.slice().sort((a, b) => a.insertAt - b.insertAt));
    } catch {
      setDetails([]);
    } finally {
      setLoadingDetails(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (activeId) fetchDetails(activeId);
    else setDetails([]);
  }, [activeId, fetchDetails]);

  /* ── Keep mobile nav in sync ──────────────────────────────────── */
  useEffect(() => {
    if (!activeId) setMobilePanel('lists');
  }, [activeId]);

  /* ── Derived ──────────────────────────────────────────────────── */
  const activeList = lists.find(l => l.id === activeId) ?? null;
  const filterCount = filter.quotas.length + filter.categories.length;

  const filteredDetails = useMemo(() => {
    if (!filterCount) return details;
    return details.filter(d => {
      if (filter.quotas.length && !filter.quotas.includes(d.quota)) return false;
      if (filter.categories.length && !filter.categories.includes(d.catagory)) return false;
      return true;
    });
  }, [details, filter, filterCount]);

  /* ── Navigation ───────────────────────────────────────────────── */
  const selectList = (id: string) => {
    setActiveId(id);
    setMobilePanel('detail');
  };

  /* ── List CRUD ────────────────────────────────────────────────── */
  const handleCreateList = async (name: string, caunselling: string) => {
    const token = await getToken();
    const created = await createChoiceList(token, { name, caunselling });
    await fetchLists();
    setActiveId(created.id);
    setMobilePanel('detail');
  };

  const handleDeleteList = async (id: string) => {
    const token = await getToken();
    await deleteChoiceList(token, id);
    const remaining = lists.filter(l => l.id !== id);
    setLists(remaining);
    if (activeId === id) setActiveId(remaining[0]?.id ?? null);
    setDeleteConfirmId(null);
  };

  const handleSaveListName = async (id: string) => {
    const name = editName.trim();
    if (!name) return;
    const token = await getToken();
    await updateChoiceList(token, id, { name });
    setLists(ls => ls.map(l => l.id === id ? { ...l, name } : l));
    setEditingId(null);
  };

  /* ── Choice CRUD ──────────────────────────────────────────────── */
  const handleAddChoice = async (
    entry: { caunselling: string; institute: string; course: string; quota: string; category: string },
    insertAt: 'top' | 'bottom' | number,
  ) => {
    if (!activeId) return;
    const token = await getToken();
    const numInsertAt =
      insertAt === 'top' ? 0 :
        insertAt === 'bottom' ? details.length :
          (insertAt as number) - 1;

    await addChoiceListDetail(token, activeId, {
      name: `${entry.institute} – ${entry.course}`,
      caunselling: entry.caunselling,
      institute: entry.institute,
      course: entry.course,
      quota: entry.quota,
      catagory: entry.category,
      insertAt: numInsertAt,
    });
    await fetchDetails(activeId);
    setLists(ls => ls.map(l => l.id === activeId ? { ...l, detailsCount: l.detailsCount + 1 } : l));
  };

  const handleRemoveChoice = async (detailId: string) => {
    if (!activeId) return;
    const token = await getToken();
    await deleteChoiceListDetail(token, detailId);
    setDetails(prev => prev.filter(d => d.id !== detailId));
    setLists(ls => ls.map(l => l.id === activeId ? { ...l, detailsCount: Math.max(0, l.detailsCount - 1) } : l));
  };

  /* ── Reorder: drag (desktop table) ────────────────────────────── */
  const onDragStart = (idx: number) => {
    if (filterCount > 0) return;
    dragSrcIdx.current = idx;
  };

  const onDragOver = (e: React.DragEvent, idx: number) => {
    if (filterCount > 0) return;
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const onDragLeave = () => setDragOverIdx(null);

  const persistOrder = async (reordered: ChoiceListDetail[]) => {
    if (!activeId) return;
    try {
      const token = await getToken();
      await reorderChoiceListDetails(token, activeId, reordered.map(d => d.id));
    } catch {
      await fetchDetails(activeId);
    }
  };

  const onDrop = async (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    const src = dragSrcIdx.current;
    if (src === null || src === targetIdx || !activeId || filterCount > 0) {
      setDragOverIdx(null);
      return;
    }
    const reordered = [...details];
    const [moved] = reordered.splice(src, 1);
    reordered.splice(targetIdx, 0, moved);
    setDetails(reordered);
    dragSrcIdx.current = null;
    setDragOverIdx(null);
    await persistOrder(reordered);
  };

  /* ── Reorder: up/down buttons (mobile cards) ──────────────────── */
  const moveDetail = async (idx: number, dir: -1 | 1) => {
    if (!activeId || filterCount > 0) return;
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= details.length) return;
    const reordered = [...details];
    [reordered[idx], reordered[targetIdx]] = [reordered[targetIdx], reordered[idx]];
    setDetails(reordered);
    await persistOrder(reordered);
  };

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <>
      <div
        className="fixed left-0 right-0 bottom-0 flex overflow-hidden bg-background"
        style={{ top: HEADER_H }}
      >
        {/* ── Sidebar / Lists panel ────────────────────────────── */}
        <aside
          className={cn(
            'flex flex-col h-full w-full md:w-72 shrink-0 border-r border-border bg-card overflow-hidden',
            mobilePanel === 'detail' && 'hidden md:flex',
          )}
        >
          <div className="px-4 py-3.5 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                <ListChecks size={15} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">Choice Lists</p>
                <p className="text-xs text-foreground-subtle">{lists.length} {lists.length === 1 ? 'list' : 'lists'}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-1.5 px-1.5">
            {loadingLists ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={18} className="animate-spin text-foreground-subtle" />
              </div>
            ) : lists.length === 0 ? (
              <p className="text-xs text-foreground-subtle text-center py-8 px-3">No lists yet.</p>
            ) : (
              lists.map(list => {
                if (editingId === list.id) {
                  return (
                    <div
                      key={list.id}
                      className="flex items-center gap-1.5 px-2 py-2 rounded-lg bg-primary-light
                        border border-primary/30 mb-0.5"
                    >
                      <input
                        autoFocus
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveListName(list.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="flex-1 min-w-0 text-xs bg-transparent outline-none text-primary font-medium"
                      />
                      <button onClick={() => handleSaveListName(list.id)} className="text-success hover:opacity-70 shrink-0">
                        <Check size={13} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-foreground-muted hover:text-error shrink-0">
                        <X size={13} />
                      </button>
                    </div>
                  );
                }

                if (deleteConfirmId === list.id) {
                  return (
                    <div key={list.id} className="px-3 py-2.5 rounded-lg bg-error-light border border-error/20 mb-0.5">
                      <p className="text-xs font-medium text-error mb-2 leading-snug">
                        Delete &ldquo;{list.name}&rdquo;?
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleDeleteList(list.id)}
                          className="flex-1 h-7 rounded-md bg-error text-white text-xs font-semibold hover:bg-error/90 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="flex-1 h-7 rounded-md border border-border text-xs font-medium text-foreground-muted hover:bg-hover transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                }

                const isActive = activeId === list.id;
                return (
                  <div
                    key={list.id}
                    onClick={() => selectList(list.id)}
                    className={cn(
                      'flex items-center gap-2 px-2.5 py-2.5 rounded-lg cursor-pointer group transition-colors mb-0.5',
                      isActive
                        ? 'bg-primary-light border border-primary/20'
                        : 'border border-transparent hover:bg-hover',
                    )}
                  >
                    <ChevronRight size={11} className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-primary' : 'text-foreground-subtle',
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-xs font-medium truncate leading-tight',
                        isActive ? 'text-primary' : 'text-foreground',
                      )}>
                        {list.name}
                      </p>
                      <p className="text-xs text-foreground-subtle truncate mt-0.5">
                        {list.detailsCount} choices · {list.caunselling.split(' ').slice(0, 2).join(' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => { e.stopPropagation(); setEditName(list.name); setEditingId(list.id); setDeleteConfirmId(null); }}
                        className="w-6 h-6 flex items-center justify-center rounded text-foreground-muted hover:text-primary hover:bg-primary/10"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteConfirmId(list.id); setEditingId(null); }}
                        className="w-6 h-6 flex items-center justify-center rounded text-foreground-muted hover:text-error hover:bg-error-light"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-border shrink-0">
            <button
              onClick={() => setShowCreate(true)}
              className="w-full h-10 flex items-center justify-center gap-1.5 rounded-lg
                bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors mb-24"
            >
              <Plus size={13} /> Create new list
            </button>
          </div>
        </aside>

        {/* ── Main / Detail panel ──────────────────────────────── */}
        <main
          className={cn(
            'flex-1 flex flex-col overflow-hidden bg-background min-w-0',
            mobilePanel === 'lists' && 'hidden md:flex',
          )}
        >
          {!activeList ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <FolderOpen size={28} className="text-foreground-subtle" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">No list selected</p>
                <p className="text-sm text-foreground-muted">Select a list from the sidebar or create a new one.</p>
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary
                  text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-colors"
              >
                <Plus size={14} /> Create new list
              </button>
            </div>
          ) : (
            <>
              {/* Top bar */}
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 border-b border-border bg-card shrink-0">
                <button
                  onClick={() => setMobilePanel('lists')}
                  className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-foreground-muted hover:bg-hover shrink-0"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="min-w-0 flex-1">
                  <h1 className="text-sm font-semibold text-foreground truncate">{activeList.name}</h1>
                  <p className="text-xs text-foreground-muted mt-px truncate">
                    {activeList.caunselling} ·{' '}
                    <span className="font-medium">{details.length} choices</span>
                    {filterCount > 0 && (
                      <span className="ml-1.5 text-primary font-semibold">· {filteredDetails.length} shown</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowFilter(true)}
                    className={cn(
                      'flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-lg border text-xs font-medium transition-colors',
                      filterCount > 0
                        ? 'border-primary/40 bg-primary-light text-primary'
                        : 'border-border text-foreground-muted hover:bg-hover hover:text-foreground',
                    )}
                  >
                    <SlidersHorizontal size={13} />
                    <span className="hidden sm:inline">Filter</span>
                    {filterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {filterCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-1.5 h-9 px-3 sm:px-3.5 rounded-lg bg-primary
                      text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors"
                  >
                    <Plus size={13} />
                    <span className="hidden sm:inline">Add choice</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              {loadingDetails ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 size={22} className="animate-spin text-foreground-subtle" />
                </div>
              ) : filteredDetails.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <ListChecks size={22} className="text-foreground-subtle" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {filterCount > 0 ? 'No matches' : 'No choices yet'}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {filterCount > 0 ? 'Try adjusting your filters.' : 'Tap "Add choice" to start building your list.'}
                    </p>
                  </div>
                  {filterCount > 0 && (
                    <button
                      onClick={() => setFilter({ quotas: [], categories: [] })}
                      className="h-9 px-3 rounded-lg border border-border text-xs font-medium text-foreground-muted hover:bg-hover transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Desktop / large screen table */}
                  <div className="hidden lg:block flex-1 overflow-auto">
                    <table
                      className="table-fixed border-collapse text-xs leading-none"
                      style={{
                        width: '100%',
                        tableLayout: 'fixed',
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            className="sticky top-0 z-30 bg-muted border-b border-r border-border
                              px-2 py-2.5 text-center whitespace-nowrap
                              font-semibold uppercase tracking-widest text-foreground-subtle"
                            style={{ left: 0, width: 42 }}
                          >
                            Order
                          </th>
                          <th
                            className="sticky top-0 z-30 bg-muted border-b border-r border-border
                              px-3 py-2.5 text-left whitespace-nowrap
                              font-semibold uppercase tracking-widest text-foreground-subtle"
                            style={{ left: 52, width: 150 }}
                          >
                            Institute
                          </th>
                          {DATA_COLS.map(col => (
                            <th
                              key={col.key}
                              style={{ width: col.w }}
                              className="sticky top-0 z-20 bg-muted border-b border-border
                                px-3 py-2.5 text-left whitespace-nowrap
                                font-semibold uppercase tracking-widest text-foreground-subtle"
                            >
                              {col.label}
                            </th>
                          ))}
                          {/* {CR_YEAR_ROUNDS.map(([year, rounds]) =>
                            Array.from({ length: rounds }, (_, i) => (
                              <th
                                key={`cr_${year}_${i + 1}`}
                                className="sticky top-0 z-20 bg-muted border-b border-border
                                  px-2 py-1.5 text-center whitespace-nowrap text-foreground-subtle"
                                style={{ width: 70 }}
                              >
                                <span className="block text-xs text-foreground-subtle/60 font-medium">{year}</span>
                                <span className="font-semibold uppercase tracking-widest">R{i + 1}</span>
                              </th>
                            ))
                          )} */}
                          <th className="sticky top-0 z-20 bg-muted border-b border-border" style={{ width: 20 }} />
                        </tr>
                      </thead>

                      <tbody>
                        {filteredDetails.map((detail, idx) => {
                          const isOver = dragOverIdx === idx;
                          const evenRow = idx % 2 === 0;
                          const cellBg = evenRow ? 'bg-card' : 'bg-background';

                          return (
                            <tr
                              key={detail.id}
                              draggable={filterCount === 0}
                              onDragStart={() => onDragStart(idx)}
                              onDragOver={e => onDragOver(e, idx)}
                              onDrop={e => onDrop(e, idx)}
                              onDragLeave={onDragLeave}
                              className={cn(
                                'group transition-colors',
                                isOver
                                  ? 'ring-2 ring-inset ring-primary/40 bg-primary-light/40'
                                  : 'hover:bg-primary-light/20',
                              )}
                            >
                              <td
                                className={cn('sticky z-10 border-b border-r border-border px-1.5 py-2 text-center', cellBg)}
                                style={{ left: 0 }}
                              >
                                <div className="flex items-center justify-center gap-0.5">
                                  <GripVertical
                                    size={12}
                                    className={cn(
                                      'text-foreground-subtle shrink-0',
                                      filterCount === 0 ? 'cursor-grab active:cursor-grabbing' : 'opacity-30',
                                    )}
                                  />
                                  <span className={cn(
                                    'text-xs font-bold flex items-center justify-center shrink-0 rounded-md w-6 h-6',
                                    idx < 3 ? 'bg-primary-light text-primary' : 'bg-muted text-foreground-muted',
                                  )}>
                                    {idx + 1}
                                  </span>
                                </div>
                              </td>

                              <td
                                className={cn('sticky z-10 border-b border-r border-border px-3 py-2 font-medium text-foreground', cellBg)}
                                style={{ left: 52 }}
                              >
                                <span className="line-clamp-1 block" >{detail.institute}</span>
                              </td>

                              {DATA_COLS.map(col => (
                                <td key={col.key} className="border-b border-border px-3 py-2 text-foreground-muted whitespace-nowrap">
                                  {(detail as unknown as Record<string, string>)[col.key] || '—'}
                                </td>
                              ))}

                              {/* {CR_YEAR_ROUNDS.map(([year, rounds]) =>
                                Array.from({ length: rounds }, (_, i) => {
                                  const numKey = String(i + 1);
                                  const roundKey = `R${i + 1}`;
                                  const closingRank = detail.closingRanks?.[year]?.[numKey] ?? detail.closingRanks?.[year]?.[roundKey];
                                  return (
                                    <td
                                      key={`cr_${year}_${i + 1}`}
                                      className="border-b border-border px-2 py-2 text-center whitespace-nowrap"
                                    >
                                      {closingRank ? (
                                        <span className="text-xs font-medium text-foreground">{closingRank}</span>
                                      ) : (
                                        <span className="text-xs text-foreground-subtle/30">—</span>
                                      )}
                                    </td>
                                  );
                                })
                              )} */}

                              <td className="border-b border-border px-1 py-2">
                                <button
                                  onClick={() => handleRemoveChoice(detail.id)}
                                  className="w-6 h-6 flex items-center justify-center rounded-md mx-auto
                                    text-foreground-subtle opacity-0 group-hover:opacity-100
                                    hover:text-error hover:bg-error-light transition-all"
                                >
                                  <X size={12} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile / tablet cards */}
                  <div className="lg:hidden flex-1 overflow-y-auto p-3 space-y-2">
                    {filteredDetails.map((detail, idx) => (
                      <ChoiceCard
                        key={detail.id}
                        detail={detail}
                        idx={idx}
                        total={filteredDetails.length}
                        canReorder={filterCount === 0}
                        onRemove={handleRemoveChoice}
                        onMove={moveDetail}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Modals ────────────────────────────────────────────── */}
      {showCreate && (
        <CreateListModal
          counsellingOpts={counsellingOpts}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreateList}
        />
      )}
      {showAdd && activeList && (
        <AddChoiceModal
          defaultCaunselling={activeList.caunselling}
          choiceCount={details.length}
          counsellingOpts={counsellingOpts}
          onClose={() => setShowAdd(false)}
          onAdd={handleAddChoice}
        />
      )}
      {showFilter && (
        <FilterModal
          filter={filter}
          onApply={setFilter}
          onClose={() => setShowFilter(false)}
        />
      )}
    </>
  );
}