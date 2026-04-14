'use client';

import { useRef, useState } from 'react';
import { ListChecks, GripVertical, ChevronUp, ChevronDown, X, Check, AlertTriangle, Info } from 'lucide-react';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';


// ─── Types ────────────────────────────────────────────────────────────────────

type Bucket = 'safe' | 'target' | 'dream';

interface Choice { id: number; name: string; course: string; }

interface CollegeMeta { cutoff: number; bucket: Bucket; tag: string; tagCls: string; }

// ─── Data ─────────────────────────────────────────────────────────────────────

const COLLEGE_META: Record<string, CollegeMeta> = {
  'AIIMS New Delhi': { cutoff: 42815, bucket: 'dream', tag: 'AIIMS', tagCls: 'bg-secondary-light text-secondary border-secondary/20' },
  'AIIMS Mumbai': { cutoff: 68200, bucket: 'dream', tag: 'AIIMS', tagCls: 'bg-secondary-light text-secondary border-secondary/20' },
  'PGIMER Chandigarh': { cutoff: 75000, bucket: 'dream', tag: 'Govt', tagCls: 'bg-muted text-foreground-muted border-border' },
  'JIPMER Puducherry': { cutoff: 52800, bucket: 'target', tag: 'JIPMER', tagCls: 'bg-primary-light text-primary border-primary/20' },
  'AIIMS Bhopal': { cutoff: 112400, bucket: 'target', tag: 'AIIMS', tagCls: 'bg-secondary-light text-secondary border-secondary/20' },
  'VMMC & Safdarjung': { cutoff: 89622, bucket: 'safe', tag: 'Govt', tagCls: 'bg-muted text-foreground-muted border-border' },
  'Maulana Azad Medical': { cutoff: 49800, bucket: 'dream', tag: 'Govt', tagCls: 'bg-muted text-foreground-muted border-border' },
};

const BUCKET_BADGE: Record<Bucket, string> = {
  safe: 'bg-success-light text-success',
  target: 'bg-warning-light text-warning',
  dream: 'bg-secondary-light text-secondary',
};

const MAX_CHOICES = 20;

const INITIAL: Choice[] = [
  { id: 1, name: 'AIIMS New Delhi', course: 'MBBS' },
  { id: 2, name: 'AIIMS Mumbai', course: 'MBBS' },
  { id: 3, name: 'PGIMER Chandigarh', course: 'MBBS' },
  { id: 4, name: 'JIPMER Puducherry', course: 'MBBS' },
  { id: 5, name: 'AIIMS Bhopal', course: 'MBBS' },
  { id: 6, name: 'VMMC & Safdarjung', course: 'MBBS' },
  { id: 7, name: 'Maulana Azad Medical', course: 'MBBS' },
];

// ─── Row ──────────────────────────────────────────────────────────────────────

function ChoiceRow({
  choice, index, total, locked,
  onMoveUp, onMoveDown, onRemove,
  isDragOver,
  onDragStart, onDragOver, onDrop, onDragLeave,
}: {
  choice: Choice; index: number; total: number; locked: boolean;
  onMoveUp: () => void; onMoveDown: () => void; onRemove: () => void;
  isDragOver: boolean;
  onDragStart: () => void; onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void; onDragLeave: () => void;
}) {
  const meta = COLLEGE_META[choice.name];
  const isTop3 = index < 3;

  return (
    <div
      draggable={!locked}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      className={cn(
        'flex items-center gap-2.5 px-4 py-2.5 border-b border-border/50 last:border-0',
        'transition-colors duration-100 group',
        isDragOver ? 'bg-success-light border-success/30' : 'hover:bg-muted/50',
      )}
    >
      {/* Drag handle */}
      <GripVertical
        size={14}
        className={cn(
          'text-foreground-subtle flex-shrink-0 transition-colors',
          locked ? 'opacity-20 cursor-not-allowed' : 'cursor-grab group-hover:text-foreground-muted',
        )}
      />

      {/* Order number */}
      <span className={cn(
        'w-[26px] h-[26px] rounded-lg flex items-center justify-center flex-shrink-0',
        'text-[11px] font-bold',
        isTop3
          ? 'bg-secondary-light text-secondary border border-secondary/20'
          : 'bg-muted border border-border text-foreground-muted',
      )}>
        {index + 1}
      </span>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-foreground truncate">{choice.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] font-medium px-1.5 py-px rounded-full
            bg-muted border border-border text-foreground-muted">{choice.course}</span>
          {meta && (
            <>
              <span className={cn(
                'text-[10px] font-medium px-1.5 py-px rounded-full border',
                meta.tagCls,
              )}>{meta.tag}</span>
              <span className={cn(
                'text-[10px] font-semibold px-1.5 py-px rounded-full',
                BUCKET_BADGE[meta.bucket],
              )}>
                {meta.bucket.charAt(0).toUpperCase() + meta.bucket.slice(1)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Move up/down */}
      <div className="flex flex-col gap-0.5 flex-shrink-0">
        {[
          { onClick: onMoveUp, disabled: index === 0, Icon: ChevronUp },
          { onClick: onMoveDown, disabled: index === total - 1, Icon: ChevronDown },
        ].map(({ onClick, disabled, Icon }, i) => (
          <button
            key={i}
            onClick={onClick}
            disabled={disabled || locked}
            className="w-5 h-[18px] flex items-center justify-center rounded border border-border
              text-foreground-subtle transition-colors
              hover:border-primary/30 hover:text-primary hover:bg-primary-light
              disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <Icon size={10} strokeWidth={2.5} />
          </button>
        ))}
      </div>

      {/* Delete */}
      <button
        onClick={onRemove}
        disabled={locked}
        className="w-[26px] h-[26px] flex items-center justify-center rounded-lg
          border border-border text-foreground-subtle flex-shrink-0 transition-colors
          hover:border-error/30 hover:text-error hover:bg-error-light
          disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <X size={12} />
      </button>
    </div>
  );
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChoiceListPage() {
  const [choices, setChoices] = useState<Choice[]>(INITIAL);
  const [locked, setLocked] = useState(false);
  const [addInput, setAddInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const dragSrcId = useRef<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  let nextId = useRef(INITIAL.length + 1);

  const moveUp = (id: number) => setChoices(cs => { const i = cs.findIndex(c => c.id === id); if (i > 0) { const a = [...cs];[a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; } return cs; });
  const moveDown = (id: number) => setChoices(cs => { const i = cs.findIndex(c => c.id === id); if (i < cs.length - 1) { const a = [...cs];[a[i + 1], a[i]] = [a[i], a[i + 1]]; return a; } return cs; });
  const remove = (id: number) => setChoices(cs => cs.filter(c => c.id !== id));

  const addCollege = () => {
    const name = addInput.trim();
    if (!name || choices.length >= MAX_CHOICES) return;
    if (choices.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    setChoices(cs => [...cs, { id: nextId.current++, name, course: 'MBBS' }]);
    setAddInput('');
  };

  const onDragStart = (id: number) => { dragSrcId.current = id; };
  const onDragOver = (e: React.DragEvent, id: number) => { e.preventDefault(); setDragOverId(id); };
  const onDragLeave = () => setDragOverId(null);
  const onDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (!dragSrcId.current || dragSrcId.current === targetId) return;
    setChoices(cs => {
      const a = [...cs];
      const si = a.findIndex(c => c.id === dragSrcId.current);
      const ti = a.findIndex(c => c.id === targetId);
      const [moved] = a.splice(si, 1);
      a.splice(ti, 0, moved);
      return a;
    });
    setDragOverId(null);
    dragSrcId.current = null;
  };

  const safe = choices.filter(c => COLLEGE_META[c.name]?.bucket === 'safe').length;
  const target = choices.filter(c => COLLEGE_META[c.name]?.bucket === 'target').length;
  const dream = choices.filter(c => COLLEGE_META[c.name]?.bucket === 'dream').length;
  const pct = Math.round((choices.length / MAX_CHOICES) * 100);

  const noSafe = safe === 0 && choices.length >= 3;
  const tooManyDream = dream > choices.length * 0.7 && choices.length >= 3;

  return (
    <div className="min-h-screen bg-background pb-16">

      <div className="px-4 sm:px-6 lg:px-10 max-w-[1450px] mx-auto mt-6 space-y-5">
        {/* Page title */}
        <div className="mb-5">
          <h1 className="text-[22px] font-semibold text-foreground">My Choice List</h1>
          <p className="text-[13px] text-foreground-muted mt-0.5">
            Arrange your preferred colleges in order. Drag to reorder, add new ones, and lock the list when ready to submit.
          </p>

          <div className="grid grid-cols-[1fr_272px] gap-4 items-start">

            {/* ── Main list ── */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Preference order
                  </span>
                  <span className="text-[11px] font-bold px-2 py-px rounded-full bg-secondary-light text-secondary">
                    {choices.length} added
                  </span>
                </div>
                <button
                  onClick={() => setLocked(v => !v)}
                  className={cn(
                    'text-[12px] font-semibold px-3 py-1 rounded-lg transition-colors',
                    locked
                      ? 'text-error bg-error-light hover:bg-error/20'
                      : 'text-primary bg-transparent hover:bg-primary-light',
                  )}
                >
                  {locked ? 'Unlock list' : 'Lock list'}
                </button>
              </div>

              {/* Rows */}
              {choices.map((c, i) => (
                <ChoiceRow
                  key={c.id}
                  choice={c}
                  index={i}
                  total={choices.length}
                  locked={locked}
                  onMoveUp={() => moveUp(c.id)}
                  onMoveDown={() => moveDown(c.id)}
                  onRemove={() => remove(c.id)}
                  isDragOver={dragOverId === c.id}
                  onDragStart={() => onDragStart(c.id)}
                  onDragOver={e => onDragOver(e, c.id)}
                  onDrop={e => onDrop(e, c.id)}
                  onDragLeave={onDragLeave}
                />
              ))}

              {/* Add row */}
              {!locked && choices.length < MAX_CHOICES && (
                <div className="flex gap-2 px-4 py-2.5 bg-muted/50 border-t border-border">
                  <input
                    value={addInput}
                    onChange={e => setAddInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCollege()}
                    placeholder="Type college name and press Add…"
                    className="flex-1 h-[34px] px-3 border border-border rounded-lg bg-card
                  text-[12px] text-foreground placeholder:text-foreground-subtle
                  outline-none focus:border-primary transition-colors"
                  />
                  <button
                    onClick={addCollege}
                    className="h-[34px] px-4 bg-primary text-primary-foreground rounded-lg
                  text-[12px] font-semibold hover:bg-primary-hover transition-colors"
                  >
                    + Add
                  </button>
                </div>
              )}
            </div>

            {/* ── Right panel ── */}
            <div className="flex flex-col gap-3">

              {/* Summary */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle mb-3">Summary</p>
                {[
                  { label: 'Choices added', value: `${choices.length} / ${MAX_CHOICES}` },
                  {
                    label: 'Status', value: locked ? 'Locked' : 'Draft',
                    valueCls: locked ? 'text-success' : 'text-warning'
                  },
                  { label: 'Round', value: 'Round 1 — AIQ' },
                ].map(r => (
                  <div key={r.label} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-[12px] text-foreground-muted">{r.label}</span>
                    <span className={cn('text-[12px] font-semibold text-foreground', r.valueCls)}>{r.value}</span>
                  </div>
                ))}

                {/* Deadline */}
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-[12px] text-foreground-muted">Deadline</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full
                bg-error-light text-error">Apr 22, 2025</span>
                </div>

                {/* Progress */}
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mt-2 mb-1">
                  <div className="h-full rounded-full bg-primary transition-[width] duration-300"
                    style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] text-foreground-subtle">{choices.length} of {MAX_CHOICES} slots used</p>

                {/* Distribution bar */}
                <div className="flex rounded-md overflow-hidden h-2 mt-3 gap-px">
                  <div className="bg-success-light transition-[flex] duration-300" style={{ flex: safe || 0.3 }} />
                  <div className="bg-warning-light transition-[flex] duration-300" style={{ flex: target || 0.3 }} />
                  <div className="bg-secondary-light transition-[flex] duration-300" style={{ flex: dream || 0.3 }} />
                </div>
                <div className="flex gap-3 mt-1.5">
                  {[
                    { label: 'Safe', cls: 'bg-success-light border-success/30', count: safe },
                    { label: 'Target', cls: 'bg-warning-light border-warning/30', count: target },
                    { label: 'Dream', cls: 'bg-secondary-light border-secondary/30', count: dream },
                  ].map(s => (
                    <span key={s.label} className="flex items-center gap-1 text-[10px] text-foreground-muted">
                      <span className={cn('w-2 h-2 rounded-sm border inline-block', s.cls)} />
                      {s.label} ({s.count})
                    </span>
                  ))}
                </div>
              </div>

              {/* Strategy check */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle mb-3">Strategy check</p>
                <div className="bg-success-light border border-success/20 rounded-lg px-3 py-2.5 flex gap-2">
                  <Info size={13} className="text-success flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-success leading-relaxed">
                    Put your <strong>safest options last</strong> and most competitive colleges first —
                    MCC allots the highest available preference.
                  </p>
                </div>
                {(noSafe || tooManyDream) && (
                  <div className="mt-2 bg-warning-light border border-warning/20 rounded-lg px-3 py-2.5 flex gap-2">
                    <AlertTriangle size={13} className="text-warning flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-warning leading-relaxed">
                      {noSafe
                        ? 'No Safe colleges in your list. Add at least 2–3 guaranteed options.'
                        : 'Over 70% Dream colleges is high risk. Balance with Safe and Target options.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                disabled={!locked || submitted}
                onClick={() => setSubmitted(true)}
                className={cn(
                  'w-full h-10 rounded-xl text-[13px] font-bold transition-colors',
                  'flex items-center justify-center gap-2',
                  submitted
                    ? 'bg-success text-success-foreground cursor-not-allowed'
                    : locked
                      ? 'bg-error text-white hover:bg-error/90'
                      : 'bg-primary text-primary-foreground opacity-40 cursor-not-allowed',
                )}
              >
                <Check size={14} />
                {submitted ? 'Submitted!' : 'Submit choice list'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}