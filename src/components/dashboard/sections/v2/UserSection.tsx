'use client';

import Link from 'next/link';
import {
  CheckCircle2, Circle, Stethoscope,
  ArrowUpRight, ChevronRight, Target,
  BarChart2, Bookmark, Bot,
} from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

export function UserSection() {
  const rank = useCountUp(2341, 1200);

  const TOP_PICKS = [
    { name: 'AIIMS Bhopal', tag: 'Safe', tagCls: 'bg-success-light text-success', rank: 890 },
    { name: 'JIPMER Puducherry', tag: 'Target', tagCls: 'bg-primary-light text-primary', rank: 512 },
    { name: 'MAMC Delhi', tag: 'Target', tagCls: 'bg-primary-light text-primary', rank: 1240 },
    { name: 'Kasturba Manipal', tag: 'Dream', tagCls: 'bg-secondary-light text-secondary', rank: 290 },
  ];

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-4">

      {/* LEFT — greeting + rank + journey */}
      <div className="relative bg-surface border border-border rounded-2xl p-6 overflow-hidden shadow-sm">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)' }} />

        <div className="relative">
          {/* greeting row */}
          <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
            <div>
              <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-widest mb-1">
                Good morning 👋
              </p>
              <h1 className="text-2xl font-black text-foreground leading-tight">Aryan Sharma</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs font-semibold bg-primary-light text-primary px-2.5 py-1 rounded-full">General · AIQ</span>
                <span className="text-xs font-semibold bg-secondary-light text-secondary px-2.5 py-1 rounded-full">NEET UG 2025</span>
                <span className="text-xs text-foreground-subtle">Score: <b className="text-foreground">650</b></span>
              </div>
            </div>

            {/* rank badge */}
            {/* rank badge */}
            <div className="bg-card border border-info-light rounded-2xl px-5 py-3.5 text-center shrink-0">
              <p className="text-[10px] font-medium text-primary uppercase tracking-widest mb-1">AIR</p>
              <p className="text-3xl font-semibold text-blue-800 dark:text-blue-300 leading-none tabular-nums">
                {rank.toLocaleString()}
              </p>
              <p className="text-[10px] text-foreground-muted mt-1">All India Rank</p>
            </div>
          </div>

          {/* journey progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-foreground">Counselling Journey</p>
              <span className="text-xs font-bold text-primary">60% Complete</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: '60%' }} />
            </div>
            <div className="grid grid-cols-4 gap-1.5 mt-1">
              {[
                { label: 'Profile', done: true },
                { label: 'Shortlist', done: true },
                { label: 'Choices', done: false },
                { label: 'Submit', done: false },
              ].map(s => (
                <div key={s.label} className={`flex items-center gap-1 text-[11px] font-semibold ${s.done ? 'text-success' : 'text-foreground-subtle'}`}>
                  {s.done ? <CheckCircle2 size={11} /> : <Circle size={11} />}
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* target row */}
          <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-muted border border-border">
            <Stethoscope size={16} className="text-primary shrink-0" />
            <p className="text-xs text-foreground-muted flex-1">
              Target: <span className="font-semibold text-foreground">MBBS · Govt College</span>
            </p>
            <Link href="/dashboard/predictor" className="text-xs font-semibold text-primary flex items-center gap-0.5">
              Predict <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">

        {/* ================= ALERT CARD ================= */}
        <div className="flex flex-col gap-3">
          <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground">Top Picks for You</h2>
              <Link href="/dashboard/recommendations" className="text-xs text-primary font-semibold">View all</Link>
            </div>
            {TOP_PICKS.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-border last:border-0">
                <div className="w-6 h-6 rounded-lg bg-primary-light flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{c.name}</p>
                  <p className="text-[10px] text-foreground-subtle">Closing rank {c.rank.toLocaleString()}</p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${c.tagCls}`}>{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
