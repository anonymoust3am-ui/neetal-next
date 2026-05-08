'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Stethoscope,
  Sparkles,
  Microscope,
  FlaskConical,
  Check,
} from 'lucide-react';
import { getCounsellingOptions } from '@/lib/api';
import type { CounsellingApiOption, CounsellingApiBody } from '@/lib/api';
import { useCounselling } from '@/contexts/CounsellingContext';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ─────────────────────────────────────────────
   ICON MAP
───────────────────────────────────────────── */

const ICON_MAP: Record<string, React.ElementType> = {
  Stethoscope,
  Sparkles,
  Microscope,
  FlaskConical,
};

function resolveIcon(name?: string): React.ElementType {
  return (name && ICON_MAP[name]) || Stethoscope;
}

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

export type { CounsellingApiOption as CounsellingOption, CounsellingApiBody as CounsellingBody };

export interface CounsellingSelection {
  counselling: CounsellingApiOption;
  body: CounsellingApiBody;
}

interface CounsellingDropdownProps {
  onChange?: (selection: CounsellingSelection) => void;
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export function CounsellingDropdown({ onChange }: CounsellingDropdownProps) {
  const [options, setOptions] = useState<CounsellingApiOption[]>([]);
  const [selected, setSelected] = useState<CounsellingSelection | null>(null);
  const { setSelection } = useCounselling();

  const [open, setOpen] = useState(false);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [hoveredBodyId, setHoveredBodyId] = useState<string | null>(null);

  const rootRef    = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* fetch counselling options from API */
  useEffect(() => {
    getCounsellingOptions()
      .then(data => {
        setOptions(data);
        if (data.length > 0 && data[0].bodies.length > 0) {
          const firstPinned = data[0].bodies.find(b => b.is_pinned) ?? data[0].bodies[0];
          const initial = { counselling: data[0], body: firstPinned };
          setSelected(initial);
          setSelection(initial);
        }
      })
      .catch(() => {});
  }, [setSelection]);

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setHoveredValue(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleMouseEnterOption = (value: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredValue(value);
  };

  const handleMouseLeaveOption = () => {
    hoverTimer.current = setTimeout(() => setHoveredValue(null), 120);
  };

  const handleMouseEnterSubPanel = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const handleMouseLeaveSubPanel = () => {
    hoverTimer.current = setTimeout(() => setHoveredValue(null), 120);
  };

  const handleSelectBody = (counselling: CounsellingApiOption, body: CounsellingApiBody) => {
    const sel = { counselling, body };
    setSelected(sel);
    setSelection(sel);
    onChange?.(sel);
    setOpen(false);
    setHoveredValue(null);
  };

  const hoveredOpt = options.find(o => o.value === hoveredValue);

  /* loading skeleton */
  if (options.length === 0) {
    return (
      <div className="h-9 w-36 rounded-xl bg-[var(--color-bg-muted)] border border-[var(--color-border)] animate-pulse" />
    );
  }

  const TriggerIcon = selected ? resolveIcon(selected.counselling.icon) : Stethoscope;
  const triggerLabel = selected
    ? selected.body.name.split('–')[0].trim()
    : '…';

  return (
    <div ref={rootRef} className="relative">

      {/* ── TRIGGER ── */}
      <button
        onClick={() => { setOpen(v => !v); setHoveredValue(null); }}
        className={cn(
          'flex items-center gap-2 h-9 px-3 rounded-xl border transition-all text-sm font-semibold select-none',
          open
            ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-primary'
            : 'bg-[var(--color-bg-muted)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
        )}
      >
        <TriggerIcon size={13} className="text-primary shrink-0" />
        <span className="max-w-[120px] truncate">{triggerLabel}</span>
        <ChevronDown
          size={12}
          className={cn(
            'text-[var(--color-icon-muted)] transition-transform duration-200 ml-0.5 shrink-0',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* ── PRIMARY DROPDOWN ── */}
      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-[1050] flex"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))' }}
        >
          {/* Left panel — counselling types */}
          <div className="w-56 bg-[var(--color-dropdown-bg)] border border-[var(--color-dropdown-border)] rounded-2xl py-1.5 overflow-hidden">
            <p className="px-4 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Counselling Type
            </p>

            {options.map(opt => {
              const OptIcon = resolveIcon(opt.icon);
              const isHovered  = hoveredValue === opt.value;
              const isSelected = selected?.counselling.value === opt.value;

              return (
                <div
                  key={opt.value}
                  onMouseEnter={() => handleMouseEnterOption(opt.value)}
                  onMouseLeave={handleMouseLeaveOption}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors select-none',
                    isHovered
                      ? 'bg-[var(--color-primary-light)] text-primary'
                      : isSelected
                      ? 'bg-[var(--color-bg-muted)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-dropdown-hover)]'
                  )}
                >
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                    isHovered ? 'bg-primary' : isSelected ? 'bg-primary' : 'bg-[var(--color-bg-muted)]'
                  )}>
                    <OptIcon
                      size={13}
                      className={isHovered || isSelected ? 'text-white' : 'text-[var(--color-icon-secondary)]'}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      'text-sm font-semibold leading-none',
                      isHovered ? 'text-primary' : isSelected ? 'text-[var(--color-text-primary)]' : ''
                    )}>
                      {opt.label}
                    </p>
                    <p className={cn(
                      'text-[10px] mt-0.5',
                      isHovered ? 'text-primary/70' : 'text-[var(--color-text-muted)]'
                    )}>
                      {opt.desc}
                    </p>
                  </div>

                  <ChevronRight
                    size={13}
                    className={cn(
                      'shrink-0 transition-colors',
                      isHovered ? 'text-primary' : 'text-[var(--color-icon-muted)]'
                    )}
                  />
                </div>
              );
            })}
          </div>

          {/* Right sub-panel — bodies list (shown on hover) */}
          {hoveredOpt && (
            <div
              onMouseEnter={handleMouseEnterSubPanel}
              onMouseLeave={handleMouseLeaveSubPanel}
              className="ml-1.5 w-80 bg-[var(--color-dropdown-bg)] border border-[var(--color-dropdown-border)] rounded-2xl py-1.5 overflow-hidden flex flex-col"
              style={{ maxHeight: 420 }}
            >
              {/* sub-panel header */}
              <div className="flex items-center gap-2 px-4 pt-2 pb-2.5 border-b border-[var(--color-border)] shrink-0">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                  {(() => { const Icon = resolveIcon(hoveredOpt.icon); return <Icon size={12} className="text-white" />; })()}
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-primary)] leading-none">{hoveredOpt.label}</p>
                  <p className="text-[9px] text-[var(--color-text-muted)] mt-0.5">{hoveredOpt.bodies.length} counselling bodies</p>
                </div>
              </div>

              {/* scrollable list */}
              <div className="overflow-y-auto flex-1 py-1" style={{ scrollbarWidth: 'thin' }}>
                {[...hoveredOpt.bodies]
                  .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
                  .map(body => {
                    const isBodySelected =
                      selected?.counselling.value === hoveredOpt.value && selected.body.id === body.id;
                    const isBodyHovered = hoveredBodyId === body.id;

                    return (
                      <button
                        key={body.id}
                        onClick={() => handleSelectBody(hoveredOpt, body)}
                        onMouseEnter={() => setHoveredBodyId(body.id)}
                        onMouseLeave={() => setHoveredBodyId(null)}
                        className={cn(
                          'w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors',
                          isBodySelected
                            ? 'bg-[var(--color-primary-light)]'
                            : isBodyHovered
                            ? 'bg-[var(--color-dropdown-hover)]'
                            : ''
                        )}
                      >
                        <div className="mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center">
                          {isBodySelected ? (
                            <Check size={13} className="text-primary" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border-strong)]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className={cn(
                              'text-s leading-snug',
                              isBodySelected
                                ? 'font-semibold text-primary'
                                : 'font-medium text-[var(--color-text-primary)]'
                            )}>
                              {body.name}
                            </p>
                            {/* {body.is_pinned && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-primary-light)] text-primary shrink-0">
                                Popular
                              </span>
                            )} */}
                          </div>
                          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                            {body.state} · {body.counselling_type}
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
