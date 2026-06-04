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
  X,
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
  
  // Desktop hover states
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [hoveredBodyId, setHoveredBodyId] = useState<string | null>(null);
  
  // Mobile navigation state
  const [activeMobileOpt, setActiveMobileOpt] = useState<CounsellingApiOption | null>(null);

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

  /* Close on outside click */
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

  /* Lock body scroll on mobile */
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden', 'md:overflow-auto');
    } else {
      document.body.classList.remove('overflow-hidden', 'md:overflow-auto');
    }
    return () => document.body.classList.remove('overflow-hidden', 'md:overflow-auto');
  }, [open]);

  const handleTriggerClick = () => {
    setOpen(v => !v);
    setHoveredValue(null);
    
    // Mobile optimization rule: If there is only 1 type (e.g. NEET UG), skip categories panel entirely
    if (window.innerWidth < 768) {
      if (options.length === 1) {
        setActiveMobileOpt(options[0]);
      } else {
        setActiveMobileOpt(null);
      }
    }
  };

  const handleMouseEnterOption = (value: string) => {
    if (window.innerWidth < 768) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredValue(value);
  };

  const handleMouseLeaveOption = () => {
    if (window.innerWidth < 768) return;
    hoverTimer.current = setTimeout(() => setHoveredValue(null), 120);
  };

  const handleSelectBody = (counselling: CounsellingApiOption, body: CounsellingApiBody) => {
    const sel = { counselling, body };
    setSelected(sel);
    setSelection(sel);
    onChange?.(sel);
    setOpen(false);
    setHoveredValue(null);
    setActiveMobileOpt(null);
  };

  const handleMouseEnterSubPanel = () => {
    if (window.innerWidth < 768) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const handleMouseLeaveSubPanel = () => {
    if (window.innerWidth < 768) return;
    hoverTimer.current = setTimeout(() => setHoveredValue(null), 120);
  };

  const hoveredOpt = options.find(o => o.value === hoveredValue);
  const isSingleOption = options.length === 1;

  /* loading skeleton */
  if (options.length === 0) {
    return (
      <div className="h-9 w-36 rounded-xl bg-[var(--color-bg-muted)] border border-[var(--color-border)] animate-pulse" />
    );
  }

  const TriggerIcon = selected ? resolveIcon(selected.counselling.icon) : Stethoscope;
  const triggerLabel = selected ? selected.body.name.split('–')[0].trim() : '…';

  return (
    <div ref={rootRef} className="relative">

      {/* ── TRIGGER ── */}
      <button
        onClick={handleTriggerClick}
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

      {/* ── MENUS CONTENT ── */}
      {open && (
        <>
          {/* MOBILE BACKDROP */}
          <div 
            className="fixed inset-0 z-[1040] bg-black/30 backdrop-blur-xs md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* DUAL INTERFACE PANELS CONTAINER */}
          <div
            className={cn(
              "z-[1050] flex flex-col md:flex-row",
              // Mobile Bottom Sheet Framework: Default to 40% height viewport window base
              "fixed inset-x-0 bottom-0 top-auto rounded-t-2xl min-h-[40vh] max-h-[80vh] bg-[var(--color-dropdown-bg)] border-t border-[var(--color-dropdown-border)] shadow-2xl overflow-hidden",
              // Desktop reset
              "md:absolute md:left-0 md:top-[calc(100%+6px)] md:bottom-auto md:inset-x-auto md:rounded-none md:bg-transparent md:border-none md:shadow-none md:min-h-0 md:max-h-none md:overflow-visible"
            )}
            style={window.innerWidth >= 768 ? { filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))' } : undefined}
          >
            
            {/* MOBILE NAVIGATION SYSTEM HEADER */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)] md:hidden shrink-0">
              {/* If there's only 1 category option total, hide the Back button completely */}
              <button 
                className={cn(
                  "text-xs font-semibold text-primary flex items-center gap-0.5", 
                  (!activeMobileOpt || isSingleOption) && "invisible"
                )}
                onClick={() => setActiveMobileOpt(null)}
              >
                <ChevronDown size={12} className="rotate-90" /> Back
              </button>
              
              <span className="text-xs font-bold text-[var(--color-text-primary)]">
                {activeMobileOpt ? activeMobileOpt.label : 'Select Counselling'}
              </span>
              
              <button 
                onClick={() => setOpen(false)} 
                className="p-1 rounded-full bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]"
              >
                <X size={14} />
              </button>
            </div>

            {/* LEFT PANEL: COUNSELLING CATEGORIES */}
            <div 
              className={cn(
                "w-full md:w-56 bg-[var(--color-dropdown-bg)] md:border md:border-[var(--color-dropdown-border)] md:rounded-2xl py-1 md:py-1.5 overflow-y-auto md:overflow-hidden",
                activeMobileOpt ? "hidden md:block" : "block"
              )}
            >
              <p className="hidden md:block px-4 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                Counselling Type
              </p>

              <div className="px-2 md:px-0">
                {options.map(opt => {
                  const OptIcon = resolveIcon(opt.icon);
                  const isHovered  = hoveredValue === opt.value;
                  const isSelected = selected?.counselling.value === opt.value;

                  return (
                    <div
                      key={opt.value}
                      onMouseEnter={() => handleMouseEnterOption(opt.value)}
                      onMouseLeave={handleMouseLeaveOption}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          setActiveMobileOpt(opt);
                        }
                      }}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors select-none rounded-lg md:rounded-none',
                        isHovered
                          ? 'bg-[var(--color-primary-light)] text-primary'
                          : isSelected
                          ? 'bg-[var(--color-bg-muted)]'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-dropdown-hover)]'
                      )}
                    >
                      <div className={cn(
                        'w-7 h-7 md:w-7 md:h-7 rounded-md flex items-center justify-center shrink-0 transition-colors',
                        isHovered || isSelected ? 'bg-primary' : 'bg-[var(--color-bg-muted)]'
                      )}>
                        <OptIcon
                          size={13}
                          className={isHovered || isSelected ? 'text-white' : 'text-[var(--color-icon-secondary)]'}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm font-semibold leading-tight text-[var(--color-text-primary)]">
                          {opt.label}
                        </p>
                        <p className="text-[10px] md:text-[10px] text-[var(--color-text-muted)] truncate">
                          {opt.desc}
                        </p>
                      </div>

                      <ChevronRight size={12} className="shrink-0 text-[var(--color-icon-muted)] ml-auto" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT PANEL: SCROLLABLE SUB-ITEMS */}
            {(() => {
              const currentTargetOpt = window.innerWidth < 768 ? activeMobileOpt : hoveredOpt;
              if (!currentTargetOpt) return null;

              return (
                <div
                  onMouseEnter={handleMouseEnterSubPanel}
                  onMouseLeave={handleMouseLeaveSubPanel}
                  className={cn(
                    "w-full bg-[var(--color-dropdown-bg)] overflow-hidden flex flex-col flex-1",
                    "h-full max-h-[calc(80vh-45px)]", // accounting for mobile sheet header height offset
                    "md:ml-1.5 md:w-80 md:border md:border-[var(--color-dropdown-border)] md:rounded-2xl md:py-1.5 md:h-auto md:max-h-[420px]"
                  )}
                >
                  {/* Desktop header tag */}
                  <div className="hidden md:flex items-center gap-2 px-4 pt-2 pb-2.5 border-b border-[var(--color-border)] shrink-0">
                    <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                      {(() => { const Icon = resolveIcon(currentTargetOpt.icon); return <Icon size={12} className="text-white" />; })()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text-primary)] leading-none">{currentTargetOpt.label}</p>
                      <p className="text-[9px] text-[var(--color-text-muted)] mt-0.5">{currentTargetOpt.bodies.length} counselling bodies</p>
                    </div>
                  </div>

                  {/* Scrollable list content */}
                  <div className="overflow-y-auto flex-1 py-1 px-2 md:px-0" style={{ scrollbarWidth: 'thin' }}>
                    {[...currentTargetOpt.bodies]
                      .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
                      .map(body => {
                        const isBodySelected =
                          selected?.counselling.value === currentTargetOpt.value && selected.body.id === body.id;
                        const isBodyHovered = hoveredBodyId === body.id;

                        return (
                          <button
                            key={body.id}
                            onClick={() => handleSelectBody(currentTargetOpt, body)}
                            onMouseEnter={() => setHoveredBodyId(body.id)}
                            onMouseLeave={() => setHoveredBodyId(null)}
                            className={cn(
                              'w-full flex items-start gap-2.5 px-3 py-2 text-left transition-colors rounded-lg md:rounded-none mb-0.5 md:mb-0',
                              isBodySelected
                                ? 'bg-[var(--color-primary-light)]'
                                : isBodyHovered || window.innerWidth < 768
                                ? 'hover:bg-[var(--color-dropdown-hover)]'
                                : ''
                            )}
                          >
                            <div className="mt-0.5 w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                              {isBodySelected ? (
                                <Check size={13} className="text-primary" />
                              ) : (
                                <span className="w-1 h-1 rounded-full bg-[var(--color-border-strong)]" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className={cn(
                                'text-xs md:text-[13px] leading-snug',
                                isBodySelected ? 'font-semibold text-primary' : 'font-medium text-[var(--color-text-primary)]'
                              )}>
                                {body.name}
                              </p>
                              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                                {body.state} · {body.counselling_type}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}