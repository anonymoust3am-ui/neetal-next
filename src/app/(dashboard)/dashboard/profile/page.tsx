'use client';

import { useState } from 'react';
import { Pencil, RefreshCw, Info, ShieldCheck, Key, Download, LogOut, Trash2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AcademicProfile {
  score: number; air: number; categoryRank: number; stateRank: number;
  state: string; category: string; pwd: boolean; year: number;
}

interface Strategy { safe: number; target: number; dream: number; }

// ─── Mock data ────────────────────────────────────────────────────────────────

const academic: AcademicProfile = {
  score: 650, air: 2341, categoryRank: 1120, stateRank: 187,
  state: 'Uttar Pradesh', category: 'General', pwd: false, year: 2025,
};

const accountItems = [
  { label: 'Change password', btn: 'Update', icon: Key, danger: false },
  { label: 'Two-factor authentication', btn: 'Enable', icon: ShieldCheck, danger: false },
  { label: 'Export data', btn: 'Export', icon: Download, danger: false },
  { label: 'Sign out', btn: 'Logout', icon: LogOut, danger: false },
  { label: 'Delete account', btn: 'Delete', icon: Trash2, danger: true },
];

const strategy: Strategy = { safe: 12, target: 8, dream: 5 };

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-foreground-subtle mb-4">
      {children}
    </p>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-[13px] text-foreground-muted">{label}</span>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-muted rounded-lg p-3">
      <p className="text-[11px] text-foreground-subtle font-medium mb-1">{label}</p>
      <p className="text-[20px] font-semibold leading-none">{value}</p>
      {sub && <p className="text-[11px] text-foreground-muted mt-1">{sub}</p>}
    </div>
  );
}

function Toggle({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(v => !v)}
      aria-checked={on}
      role="switch"
      className={`relative w-10 h-[22px] rounded-full border-none flex-shrink-0
        transition-colors duration-200 ${on ? 'bg-primary' : 'bg-border'}`}
    >
      <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white
        shadow-sm transition-[left] duration-200
        ${on ? 'left-[21px]' : 'left-[3px]'}`}
      />
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const completeness = 70;

  return (
    <div className="max-w-[1250px] mx-auto px-8 py-6 flex flex-col gap-5">

      {/* Page title */}
      <div>
        <h1 className="text-[22px] font-semibold text-foreground">My profile</h1>
        <p className="text-[13px] text-foreground-muted mt-0.5">
          Manage your identity, strategy, and account preferences
        </p>
      </div>

      {/* ── Header ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-[52px] h-[52px] rounded-full bg-primary-light flex items-center
              justify-center text-[17px] font-semibold text-primary flex-shrink-0">
              AK
            </div>
            <div>
              <p className="text-[17px] font-semibold text-foreground">Arjun Kumar</p>
              <p className="text-[12px] text-foreground-muted mt-0.5">arjun.kumar@gmail.com</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { label: 'NEET UG', cls: 'bg-primary-light text-primary' },
                  { label: 'General', cls: 'bg-accent-light text-accent' },
                  { label: 'Uttar Pradesh', cls: 'bg-secondary-light text-secondary' },
                  { label: '2025', cls: 'bg-success-light text-success' },
                ].map(b => (
                  <span key={b.label}
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${b.cls}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border
              text-[12px] font-medium text-foreground hover:bg-hover transition-colors">
              <Pencil size={12} /> Edit profile
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-foreground-muted">Profile strength {completeness}%</span>
              <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${completeness}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Academic + Preferences ── */}
      <div className="grid grid-cols-2 gap-5">

        <div className="bg-card border border-border rounded-xl p-5">
          <SectionLabel>Academic profile</SectionLabel>
          <div className="grid grid-cols-4 gap-2.5 mb-3">
            <StatCard label="NEET score" value={academic.score} sub="out of 720" />
            <StatCard label="AIR rank" value={academic.air.toLocaleString()} />
            <StatCard label="Category rank" value={academic.categoryRank.toLocaleString()} />
            <StatCard label="State rank" value={academic.stateRank} sub="UP" />
          </div>
          <FieldRow label="Category" value={academic.category} />
          <FieldRow label="PwD" value={academic.pwd ? 'Yes' : 'No'} />
          <FieldRow label="Domicile" value={academic.state} />
          <div className="flex gap-2 items-start mt-3 bg-success-light border border-success/20
            rounded-lg px-3 py-2">
            <Info size={14} className="text-success mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-success leading-relaxed">
              Target <strong>State quota (UP)</strong> over AIQ — your state rank gives a significant edge.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <SectionLabel>Preferences</SectionLabel>
          <FieldRow label="Preferred states" value="UP, Delhi, Maharashtra" />
          <FieldRow label="College type" value="Government" />
          <FieldRow label="Budget" value="Up to ₹10L / yr" />
          <FieldRow label="Bond tolerance" value="Up to 1 year" />
          <FieldRow label="Hostel" value="Required" />
          <FieldRow label="Language" value="Hindi / English" />
        </div>
      </div>

      {/* ── Strategy ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <SectionLabel>My strategy</SectionLabel>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary
            text-primary-foreground text-[12px] font-medium hover:bg-primary-hover transition-colors">
            <RefreshCw size={12} /> Regenerate with AI
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: strategy.safe, label: 'Safe colleges', cls: 'bg-success-light', numCls: 'text-success', lblCls: 'text-success' },
            { num: strategy.target, label: 'Target colleges', cls: 'bg-info-light', numCls: 'text-info', lblCls: 'text-info' },
            { num: strategy.dream, label: 'Dream colleges', cls: 'bg-secondary-light', numCls: 'text-secondary', lblCls: 'text-secondary' },
          ].map(c => (
            <div key={c.label} className={`${c.cls} rounded-lg p-4`}>
              <p className={`text-[26px] font-bold leading-none ${c.numCls}`}>{c.num}</p>
              <p className={`text-[12px] font-medium mt-1.5 ${c.lblCls}`}>{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Plan + Notifications + Account ── */}
      <div className="grid grid-cols-2 gap-5">

        {/* Plan */}
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionLabel>Subscription</SectionLabel>
          <div className="bg-success-light border border-success/20 rounded-lg p-3 mb-3">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full
              bg-success/20 text-success">Free plan</span>
            <p className="text-[14px] font-semibold text-success mt-2">Basic access</p>
          </div>
          <div className="bg-warning-light border border-warning/20 rounded-lg px-3 py-2.5 mb-3">
            <p className="text-[11px] font-semibold text-warning mb-1.5">Missing on Free</p>
            {['AI strategy & mistake detection', 'Round-wise cutoff predictions'].map(m => (
              <p key={m} className="text-[12px] text-warning/90 flex items-center gap-1.5 mb-1">
                <Info size={11} className="flex-shrink-0" /> {m}
              </p>
            ))}
          </div>
          <button className="w-full bg-primary text-primary-foreground rounded-lg py-2.5
            text-[13px] font-medium hover:bg-primary-hover transition-colors">
            Upgrade to Pro
          </button>
        </div>

        <div className="flex flex-col gap-5">

          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionLabel>Notifications</SectionLabel>
            {[
              { label: 'Email alerts', sub: 'Updates and reminders', on: true },
              { label: 'Counselling alerts', sub: 'Round dates, seat matrix', on: true },
              { label: 'Cutoff alerts', sub: 'When shortlisted cutoffs change', on: false },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between py-2
                border-b border-border/50 last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-foreground">{n.label}</p>
                  <p className="text-[11px] text-foreground-muted">{n.sub}</p>
                </div>
                <Toggle defaultOn={n.on} />
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <SectionLabel>Account</SectionLabel>

            {accountItems.map((s) => {
              const Icon = s.icon;

              return (
                <div
                  key={s.label}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {/* <Icon
                      size={16}
                      className={s.danger ? "text-error" : "text-muted-foreground"}
                    /> */}
                    <span
                      className={`text-[13px] font-medium ${s.danger ? "text-error" : "text-foreground"
                        }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  <button className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5
                    rounded-md border transition-colors duration-150
                    ${s.danger
                      ? 'text-error border-error/30 hover:bg-error-light'
                      : 'text-foreground border-border hover:bg-hover'}`}>
                    <s.icon size={11} /> {s.btn}
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}