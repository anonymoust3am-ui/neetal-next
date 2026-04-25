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

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

export interface CounsellingBody {
  id: string;
  name: string;
  quota: string;
}

export interface CounsellingOption {
  value: string;
  label: string;
  icon: React.ElementType;
  desc: string;
  bodies: CounsellingBody[];
}

export const COUNSELLING_OPTIONS: CounsellingOption[] = [
  {
    value: 'neet-ug',
    label: 'NEET UG',
    icon: Stethoscope,
    desc: 'MBBS / BDS / BAMS',
    bodies: [
      { id: 'ai-md',        name: 'All India UG – Medical & Dental',            quota: 'All India'                            },
      { id: 'afms',         name: 'AFMS (through MCC) – UG Medical',            quota: 'AFMS'                                 },
      { id: 'andaman',      name: 'Andaman & Nicobar Islands – UG Medical',     quota: 'Government Quota'                     },
      { id: 'ap-govt',      name: 'Andhra Pradesh Government Quota – UG',       quota: 'Government Quota'                     },
      { id: 'ap-mgmt',      name: 'Andhra Pradesh Management Quota – UG',       quota: 'Management Quota'                     },
      { id: 'arunachal',    name: 'Arunachal Pradesh – UG Medical',             quota: 'Government Quota'                     },
      { id: 'assam',        name: 'Assam – UG Medical',                         quota: 'Government Quota'                     },
      { id: 'bihar',        name: 'Bihar – UG Medical',                         quota: 'Government Quota and Management Quota'},
      { id: 'chandigarh',   name: 'Chandigarh – UG Medical',                   quota: 'Government Quota'                     },
      { id: 'chhattisgarh', name: 'Chhattisgarh – UG Medical',                 quota: 'Government Quota and Management Quota'},
      { id: 'dadra',        name: 'Dadra and Nagar Haveli – UG Medical',        quota: 'Government Quota and Management Quota'},
      { id: 'delhi',        name: 'Delhi – UG Medical',                         quota: 'Government Quota'                     },
      { id: 'goa',          name: 'Goa – UG Medical',                           quota: 'Government Quota'                     },
      { id: 'gujarat',      name: 'Gujarat – UG Medical',                       quota: 'Government Quota'                     },
      { id: 'haryana',      name: 'Haryana – UG Medical',                       quota: 'Government Quota and Management Quota'},
      { id: 'himachal',     name: 'Himachal Pradesh – UG Medical',              quota: 'Government Quota and Management Quota'},
      { id: 'jk',           name: 'Jammu and Kashmir – UG Medical',             quota: 'Government Quota and Management Quota'},
      { id: 'jharkhand',    name: 'Jharkhand – UG Medical',                     quota: 'Government Quota'                     },
      { id: 'karnataka',    name: 'Karnataka – UG Medical',                     quota: 'Government Quota and Management Quota'},
      { id: 'kerala',       name: 'Kerala – UG Medical',                        quota: 'Government Quota and Management Quota'},
      { id: 'mp',           name: 'Madhya Pradesh – UG Medical',                quota: 'Government Quota and Management Quota'},
      { id: 'maharashtra',  name: 'Maharashtra – UG Medical',                   quota: 'Government Quota and Management Quota'},
      { id: 'manipur',      name: 'Manipur – UG Medical',                       quota: 'Government Quota'                     },
      { id: 'meghalaya',    name: 'Meghalaya – UG Medical',                     quota: 'Government Quota'                     },
      { id: 'mizoram',      name: 'Mizoram – UG Medical',                       quota: 'Government Quota'                     },
      { id: 'nagaland',     name: 'Nagaland – UG Medical',                      quota: 'Government Quota'                     },
      { id: 'neigrihms',    name: 'NEIGRIHMS – UG Medical',                    quota: 'Government Quota'                     },
      { id: 'odisha',       name: 'Odisha – UG Medical',                        quota: 'Government Quota and Management Quota'},
      { id: 'open-seats',   name: 'Open Seats (Private Institute)',             quota: 'Open State Seats'                     },
      { id: 'pondicherry',  name: 'Pondicherry – UG Medical',                   quota: 'Government Quota and Management Quota'},
      { id: 'punjab',       name: 'Punjab – UG Medical',                        quota: 'Government Quota and Management Quota'},
      { id: 'rajasthan',    name: 'Rajasthan – UG Medical',                     quota: 'Government Quota and Management Quota'},
      { id: 'rims-manipur', name: 'RIMS Manipur – UG Medical',                 quota: 'Government Quota'                     },
      { id: 'sikkim-mu',    name: 'Sikkim Manipal University – UG Medical',    quota: 'Government Quota and Management Quota'},
      { id: 'sikkim',       name: 'Sikkim – UG Medical',                        quota: 'Government Quota'                     },
      { id: 'tn-govt',      name: 'Tamil Nadu Government Quota – UG Medical',   quota: 'Government Quota'                     },
      { id: 'tn-mgmt',      name: 'Tamil Nadu Management Quota – UG Medical',   quota: 'Management Quota'                     },
      { id: 'telangana-g',  name: 'Telangana Government Quota – UG Medical',    quota: 'Government Quota'                     },
      { id: 'telangana-m',  name: 'Telangana Management Quota – UG Medical',   quota: 'Management Quota'                     },
      { id: 'tripura',      name: 'Tripura – UG Medical',                       quota: 'Government Quota'                     },
      { id: 'uttarakhand',  name: 'Uttarakhand – UG Medical',                   quota: 'Government Quota and Management Quota'},
      { id: 'up',           name: 'Uttar Pradesh – UG Medical',                 quota: 'Government Quota and Management Quota'},
      { id: 'wb',           name: 'West Bengal – UG Medical',                   quota: 'Government Quota and Management Quota'},
    ],
  },
  {
    value: 'neet-pg',
    label: 'NEET PG',
    icon: Sparkles,
    desc: 'MD / MS / Diploma',
    bodies: [
      { id: 'pg-ai',        name: 'All India PG Medical',                       quota: 'All India'                            },
      { id: 'pg-delhi',     name: 'Delhi – PG Medical',                         quota: 'Government Quota'                     },
      { id: 'pg-karnataka', name: 'Karnataka – PG Medical',                     quota: 'Government Quota and Management Quota'},
      { id: 'pg-kerala',    name: 'Kerala – PG Medical',                        quota: 'Government Quota and Management Quota'},
      { id: 'pg-maha',      name: 'Maharashtra – PG Medical',                   quota: 'Government Quota and Management Quota'},
      { id: 'pg-tn',        name: 'Tamil Nadu – PG Medical',                    quota: 'Government Quota'                     },
      { id: 'pg-up',        name: 'Uttar Pradesh – PG Medical',                 quota: 'Government Quota and Management Quota'},
    ],
  },
  {
    value: 'neet-ss',
    label: 'NEET SS',
    icon: Microscope,
    desc: 'Super Speciality',
    bodies: [
      { id: 'ss-ai',        name: 'All India SS Medical',                       quota: 'All India'                            },
      { id: 'ss-delhi',     name: 'Delhi – SS Medical',                         quota: 'Government Quota'                     },
      { id: 'ss-pgi',       name: 'PGI Chandigarh – SS Medical',               quota: 'Institute Quota'                      },
    ],
  },
  {
    value: 'aiapget',
    label: 'AIAPGET',
    icon: FlaskConical,
    desc: 'Ayush PG Entrance',
    bodies: [
      { id: 'ayush-ai',     name: 'All India Ayush PG',                         quota: 'All India'                            },
      { id: 'ayush-ap',     name: 'Andhra Pradesh – Ayush PG',                 quota: 'Government Quota'                     },
      { id: 'ayush-gj',     name: 'Gujarat – Ayush PG',                         quota: 'Government Quota'                     },
      { id: 'ayush-mh',     name: 'Maharashtra – Ayush PG',                     quota: 'Government Quota and Management Quota'},
      { id: 'ayush-up',     name: 'Uttar Pradesh – Ayush PG',                   quota: 'Government Quota and Management Quota'},
    ],
  },
];

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

export interface CounsellingSelection {
  counselling: CounsellingOption;
  body: CounsellingBody;
}

interface CounsellingDropdownProps {
  /** Called whenever user picks a counselling type + body */
  onChange?: (selection: CounsellingSelection) => void;
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export function CounsellingDropdown({ onChange }: CounsellingDropdownProps) {
  /* what the trigger button shows */
  const [selected, setSelected] = useState<CounsellingSelection>({
    counselling: COUNSELLING_OPTIONS[0],
    body: COUNSELLING_OPTIONS[0].bodies[0],
  });

  /* primary dropdown open */
  const [open, setOpen] = useState(false);

  /* which counselling option row is hovered → shows sub-panel */
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  /* track hovered body id to highlight it */
  const [hoveredBodyId, setHoveredBodyId] = useState<string | null>(null);

  const rootRef   = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleSelectBody = (counselling: CounsellingOption, body: CounsellingBody) => {
    const selection = { counselling, body };
    setSelected(selection);
    onChange?.(selection);
    setOpen(false);
    setHoveredValue(null);
  };

  const { counselling: selCounselling, body: selBody } = selected;
  const TriggerIcon = selCounselling.icon;

  /* the hovered counselling option (for sub-panel) */
  const hoveredOpt = COUNSELLING_OPTIONS.find(o => o.value === hoveredValue);

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
        <span className="max-w-[120px] truncate">{selBody.name.split('–')[0].trim()}</span>
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

            {COUNSELLING_OPTIONS.map(opt => {
              const OptIcon = opt.icon;
              const isHovered = hoveredValue === opt.value;
              const isSelected = selected.counselling.value === opt.value;

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
                  {/* icon */}
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                    isHovered ? 'bg-primary' : isSelected ? 'bg-primary' : 'bg-[var(--color-bg-muted)]'
                  )}>
                    <OptIcon
                      size={13}
                      className={isHovered || isSelected ? 'text-white' : 'text-[var(--color-icon-secondary)]'}
                    />
                  </div>

                  {/* label */}
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

                  {/* arrow */}
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
                  <hoveredOpt.icon size={12} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-primary)] leading-none">{hoveredOpt.label}</p>
                  <p className="text-[9px] text-[var(--color-text-muted)] mt-0.5">{hoveredOpt.bodies.length} counselling bodies</p>
                </div>
              </div>

              {/* scrollable list */}
              <div className="overflow-y-auto flex-1 py-1" style={{ scrollbarWidth: 'thin' }}>
                {hoveredOpt.bodies.map(body => {
                  const isBodySelected =
                    selected.counselling.value === hoveredOpt.value && selected.body.id === body.id;
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
                      {/* selected check / dot */}
                      <div className="mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center">
                        {isBodySelected ? (
                          <Check size={13} className="text-primary" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border-strong)]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className={cn(
                          'text-s leading-snug',
                          isBodySelected
                            ? 'font-semibold text-primary'
                            : 'font-medium text-[var(--color-text-primary)]'
                        )}>
                          {body.name}
                        </p>
                        {/* <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-none">
                          {body.quota}
                        </p> */}
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