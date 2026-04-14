'use client';

import Link from 'next/link';
import {
  CheckCircle2, Circle, Stethoscope,
  ArrowUpRight, ChevronRight, Target,
  BarChart2, Bookmark, Bot,
} from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

export function HeroSection() {
  const rank = useCountUp(2341, 1200);

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
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

          {/* soft glow background (theme-safe, no harsh gradient) */}
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />

          {/* subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, var(--color-border), var(--color-border) 1px, transparent 1px, transparent 6px)',
            }}
          />

          <div className="relative p-5">

            {/* LIVE badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-foreground-subtle">
                Live Update
              </p>
            </div>

            {/* headline */}
            <h3 className="text-lg font-bold text-foreground leading-tight">
              Round 2 opens
              <br />
              in 5 days
            </h3>

            {/* subtext */}
            <p className="text-sm text-foreground-muted mt-1">
              Review AI recommendations before locking choices.
            </p>

            {/* CTA */}
            <Link
              href="/dashboard/choices"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary px-3 py-2 text-xs font-semibold border border-primary/20 transition-colors"
            >
              Review Choice List
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4">

          <p className="text-[11px] font-bold uppercase tracking-widest text-foreground-subtle mb-3">
            Quick Actions
          </p>

          <div className="space-y-1">

            {[
              {
                icon: Target,
                label: 'Predict My College',
                href: '/dashboard/predictor',
                accent: 'bg-primary/10 text-primary',
              },
              {
                icon: BarChart2,
                label: 'View Cutoffs',
                href: '/dashboard/cutoffs',
                accent: 'bg-secondary/10 text-secondary',
              },
              {
                icon: Bookmark,
                label: 'My Shortlist',
                href: '/dashboard/shortlist',
                accent: 'bg-accent/10 text-accent',
              },
              {
                icon: Bot,
                label: 'Ask AI Assistant',
                href: '/dashboard/ai',
                accent: 'bg-warning/10 text-warning',
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted transition-colors"
              >
                {/* icon */}
                <div
                  className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${item.accent}`}
                >
                  <item.icon size={14} />
                </div>

                {/* label */}
                <span className="text-sm font-medium text-foreground-muted group-hover:text-foreground transition-colors flex-1">
                  {item.label}
                </span>

                {/* arrow */}
                <ChevronRight
                  size={13}
                  className="text-foreground-subtle group-hover:text-foreground-muted transition-colors"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
