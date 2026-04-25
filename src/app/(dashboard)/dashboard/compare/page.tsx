'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, X, Search, BarChart2, CheckCircle2,
  AlertTriangle, Banknote, Users, Trophy,
  Home, ChevronRight, GraduationCap, MapPin,
  Star, ArrowUpRight,
} from 'lucide-react';

// ─── static data ─────────────────────────────────────────────────────────────
const ALL_COLLEGES = [
  { id: 1509, name: 'AIIMS New Delhi', state: 'Delhi', type: 'INI (Institute of National Importance)', fees: 1628, cutoff: 42815, bond: false, bondYears: 0, bondAmt: 0, seats: 107, stipend: 17500, hostelFees: 35000 },
  { id: 2, name: 'MAMC, New Delhi', state: 'Delhi', type: 'Government Institute', fees: 7200, cutoff: 58340, bond: true, bondYears: 1, bondAmt: 1000000, seats: 250, stipend: 0, hostelFees: 30000 },
  { id: 3, name: 'VMMC & Safdarjung', state: 'Delhi', type: 'Government Institute', fees: 5000, cutoff: 89622, bond: true, bondYears: 2, bondAmt: 2000000, seats: 150, stipend: 0, hostelFees: 28000 },
  { id: 4, name: 'Maulana Azad Medical College', state: 'Delhi', type: 'Government Institute', fees: 3200, cutoff: 49800, bond: true, bondYears: 1, bondAmt: 1000000, seats: 250, stipend: 0, hostelFees: 32000 },
  { id: 5, name: 'B.J. Medical College', state: 'Gujarat', type: 'Government Institute', fees: 12000, cutoff: 78200, bond: true, bondYears: 2, bondAmt: 2000000, seats: 250, stipend: 0, hostelFees: 20000 },
  { id: 6, name: 'AIIMS Jodhpur', state: 'Rajasthan', type: 'INI (Institute of National Importance)', fees: 1628, cutoff: 84300, bond: false, bondYears: 0, bondAmt: 0, seats: 100, stipend: 17500, hostelFees: 32000 },
  { id: 7, name: 'JIPMER Puducherry', state: 'Puducherry', type: 'INI (Institute of National Importance)', fees: 4250, cutoff: 68100, bond: false, bondYears: 0, bondAmt: 0, seats: 150, stipend: 15000, hostelFees: 25000 },
  { id: 8, name: 'Grant Medical College', state: 'Maharashtra', type: 'Government Institute', fees: 35000, cutoff: 95300, bond: true, bondYears: 2, bondAmt: 3000000, seats: 185, stipend: 0, hostelFees: 18000 },
  { id: 9, name: 'AIIMS Bhopal', state: 'M.P.', type: 'INI (Institute of National Importance)', fees: 1628, cutoff: 72600, bond: false, bondYears: 0, bondAmt: 0, seats: 100, stipend: 17500, hostelFees: 28000 },
  { id: 10, name: 'Seth GS Medical College', state: 'Maharashtra', type: 'Government Institute', fees: 31000, cutoff: 88600, bond: true, bondYears: 2, bondAmt: 3000000, seats: 200, stipend: 0, hostelFees: 22000 },
];

type College = (typeof ALL_COLLEGES)[0];
type Slot = College | null;

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
  { key: 'cutoff', label: 'AIQ Closing Rank', icon: Trophy, accent: '#d97706', format: v => (v as number).toLocaleString('en-IN'), numeric: true, lowerIsBetter: true },
  { key: 'fees', label: 'Annual Tuition Fee', icon: Banknote, accent: '#0d9488', format: v => fmtFee(v as number), numeric: true, lowerIsBetter: true },
  { key: 'bond', label: 'Bond Requirement', icon: AlertTriangle, accent: '#f59e0b', format: v => v ? 'Yes' : 'No', special: 'bond' },
  { key: 'bondYears', label: 'Bond Duration', icon: AlertTriangle, accent: '#f59e0b', format: v => v ? `${v} years` : '—', numeric: true, lowerIsBetter: true },
  { key: 'bondAmt', label: 'Bond Amount', icon: Banknote, accent: '#ef4444', format: v => v ? fmtFee(v as number) : '—', numeric: true, lowerIsBetter: true },
  { key: 'seats', label: 'MBBS Seats', icon: Users, accent: '#0d9488', format: v => String(v), numeric: true, lowerIsBetter: false },
  { key: 'stipend', label: 'Internship Stipend', icon: Banknote, accent: '#16a34a', format: v => v ? `₹${(v as number).toLocaleString('en-IN')}/mo` : 'None', numeric: true, lowerIsBetter: false },
  { key: 'hostelFees', label: 'Hostel Fee (Annual)', icon: Home, accent: '#0ea5e9', format: v => fmtFee(v as number), numeric: true, lowerIsBetter: true },
];

// ─── sub-components ──────────────────────────────────────────────────────────
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

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const [slots, setSlots] = useState<Slot[]>([null, null, null, null]);
  const [addingTo, setAddingTo] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const activeCount = slots.filter(Boolean).length;

  const filtered = ALL_COLLEGES.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) &&
      !slots.some(s => s?.id === c.id)
  );

  function addCollege(c: College) {
    if (addingTo === null) return;
    const next = [...slots];
    next[addingTo] = c;
    setSlots(next);
    setAddingTo(null);
    setSearch('');
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


      <div className="px-4 sm:px-6 lg:px-10 max-w-[1450px] mx-auto mt-6 space-y-5 pt-18">

        {/* Page title */}
        <div className="mb-5">
          <h1 className="text-2xl  font-bold text-foreground">Compare Colleges</h1>
          <p className="text-l text-foreground-muted mt-0.5">
            Compare colleges side-by-side across key parameters like fees, AIQ cutoff, bond requirements, and more.
          </p>
        </div>

        {/* ── comparison table ── */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '640px' }}>

              {/* ── college slot headers ── */}
              <thead>
                <tr className="border-b border-border">
                  {/* param label col */}
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

              {/* ── data rows ── */}
              <tbody>
                {ROWS.map((row, ri) => {
                  const bestIdx = row.numeric ? getBestIdx(row.key, row.lowerIsBetter ?? true) : -1;
                  const isAltRow = ri % 2 === 1;

                  return (
                    <tr
                      key={row.key}
                      className={`border-b border-border last:border-0 transition-colors hover:bg-muted/60 ${isAltRow ? 'bg-muted/30' : ''}`}
                    >
                      {/* label */}
                      <td className="sticky left-0 z-10 bg-inherit px-5 py-3.5 border-r border-border">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: row.accent + '15' }}>
                            <row.icon size={12} style={{ color: row.accent }} />
                          </div>
                          <span className="text-xs font-semibold text-foreground-muted">{row.label}</span>
                        </div>
                      </td>

                      {/* values */}
                      {slots.map((slot, idx) => {
                        if (!slot) return (
                          <td key={idx} className="px-5 py-3.5 border-l border-border">
                            <span className="text-xs text-foreground-subtle">—</span>
                          </td>
                        );

                        const val = slot[row.key];
                        const isBest = idx === bestIdx;

                        return (
                          <td
                            key={idx}
                            className={`px-5 py-3.5 border-l border-border transition-colors ${isBest ? 'bg-success/5' : ''}`}
                          >
                            {row.special === 'bond' ? (
                              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${val
                                ? 'bg-warning/10 text-warning'
                                : 'bg-success/10 text-success'
                                }`}>
                                {val
                                  ? <><AlertTriangle size={10} /> Bond Required</>
                                  : <><CheckCircle2 size={10} /> No Bond</>
                                }
                              </span>
                            ) : row.key === 'type' ? (
                              (() => {
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
                              })()
                            ) : row.key === 'state' ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                                <MapPin size={9} className="text-foreground-subtle" />
                                {String(val)}
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className={`text-xs tabular-nums ${isBest ? 'font-bold text-success' : 'font-semibold text-foreground'
                                  }`}>
                                  {row.format(val)}
                                </span>
                                {isBest && row.numeric && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                                    <Star size={8} fill="currentColor" /> Best
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* table footer */}
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
            <p className="text-[11px] text-foreground-subtle">Data from MCC / NMC · AIQ cutoffs are approximate</p>
          </div>
        </div>

        {/* ── empty state helper ── */}
        {activeCount === 0 && (
          <div className="bg-surface border border-border rounded-2xl p-10 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BarChart2 size={24} className="text-primary" />
            </div>
            <p className="text-base font-bold text-foreground mb-1">Start comparing colleges</p>
            <p className="text-sm text-foreground-muted mb-5 max-w-xs mx-auto">
              Click the <span className="font-bold text-primary">+ Add college</span> buttons in the table above to add up to 4 colleges for a side-by-side comparison.
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
          <div className="grid sm:grid-cols-3 gap-4">
            {/* cheapest */}
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

            {/* best cutoff */}
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

            {/* no bond */}
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

      {/* ── add college modal ── */}
      {addingTo !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => { setAddingTo(null); setSearch(''); }}
        >
          <div
            className="bg-surface border border-border rounded-2xl shadow-lg w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plus size={15} className="text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground">Add a College</p>
              </div>
              <button
                onClick={() => { setAddingTo(null); setSearch(''); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground-subtle hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* search */}
            <div className="px-4 pt-4 pb-2">
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
            </div>

            {/* results list */}
            <div className="px-3 pb-4 flex flex-col gap-1 max-h-80 overflow-y-auto">
              {filtered.length > 0 ? filtered.map(c => {
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
                      <p className="text-[10px] text-foreground-subtle mt-0.5">{c.state} · {fmtFee(c.fees)}/yr · Rank {c.cutoff.toLocaleString()}</p>
                    </div>
                    <Plus size={13} className="text-foreground-subtle group-hover:text-primary shrink-0 transition-colors" />
                  </button>
                );
              }) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Search size={22} className="text-foreground-subtle mb-2" />
                  <p className="text-sm font-semibold text-foreground-muted">No colleges found</p>
                  <p className="text-xs text-foreground-subtle mt-0.5">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
