'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Building2, CheckCircle2, Circle, Stethoscope, ArrowUpRight, UserCircle,
} from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { useAuth } from '@/contexts/AuthContext';
import { getChoiceLists } from '@/lib/api';

const TOP_PICKS = [
  { name: 'AIIMS Bhopal', location: 'Madhya Pradesh', tag: 'Safe', tagCls: 'bg-success-light text-success', rank: 890 },
  { name: 'JIPMER Puducherry', location: 'Puducherry', tag: 'Target', tagCls: 'bg-primary-light text-primary', rank: 512 },
  { name: 'Maulana Azad Medical College', location: 'Delhi', tag: 'Target', tagCls: 'bg-primary-light text-primary', rank: 1240 },
  { name: 'Kasturba Medical College', location: 'Manipal', tag: 'Dream', tagCls: 'bg-secondary-light text-secondary', rank: 290 },
];

export function UserSection() {
  const { user, firebaseUser } = useAuth();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [sectionInView, setSectionInView] = useState(false);
  const rank = useCountUp(2341, 1600, sectionInView);
  const [choiceListCount, setChoiceListCount] = useState<number | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    firebaseUser.getIdToken()
      .then(token => getChoiceLists(token, { limit: 1 }))
      .then(r => setChoiceListCount(r.total))
      .catch(() => {});
  }, [firebaseUser]);

  const journey = [
    { label: 'Profile',  done: user?.isProfileComplete ?? false },
    { label: 'Shortlist', done: false },
    { label: 'Choices',  done: (choiceListCount ?? 0) > 0 },
    { label: 'Submit',   done: false },
  ];

  const progressPct = Math.round((journey.filter(s => s.done).length / journey.length) * 100);

  const displayName    = user?.name ?? 'Student';
  const categoryBadge  = user?.category ? `${user.category} · AIQ` : 'AIQ';

  return (
    <div ref={sectionRef} className="space-y-4 pt-8">
      {!user?.isProfileComplete && (
        <div className="hidden sm:flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-3 min-w-0">
            <UserCircle className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">Complete your profile</span>
              <span className="text-foreground-muted ml-1.5 hidden sm:inline">to unlock personalized recommendations.</span>
            </p>
          </div>
          <Link
            href="/dashboard/profile"
            className="shrink-0 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
          >
            Complete now
          </Link>
        </div>
      )}

      {!user?.isProfileComplete && (
        <div className="sm:hidden rounded-2xl border border-primary/25 bg-primary/10 p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
              <UserCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground">Complete your profile</p>
              <p className="mt-0.5 text-xs leading-relaxed text-foreground-muted">
                Unlock better recommendations and journey tracking.
              </p>
            </div>
            <Link
              href="/dashboard/profile"
              className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground"
            >
              Start
            </Link>
          </div>
        </div>
      )}

      {/* Mobile */}
      <div className="sm:hidden">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="absolute -right-14 -top-16 h-40 w-40 rounded-full bg-primary/10 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-secondary/10 pointer-events-none" />

          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">
                  Your dashboard
                </p>
                <h1 className="mt-1 truncate text-2xl font-black leading-tight text-foreground">
                  {displayName}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-bold text-primary">
                    {categoryBadge}
                  </span>
                  <span className="rounded-full bg-secondary-light px-2.5 py-1 text-[11px] font-bold text-secondary">
                    NEET UG 2025
                  </span>
                </div>
              </div>

              <div className="shrink-0 rounded-2xl border border-info-light bg-card px-4 py-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-primary">AIR</p>
                <p className="mt-1 text-2xl font-semibold leading-none tabular-nums text-blue-800 dark:text-blue-300">
                  {rank.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-border bg-background/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                  Score
                </p>
                <p className="mt-1 text-lg font-black leading-none text-foreground">650</p>
              </div>
              <div className="rounded-xl border border-border bg-background/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                  Progress
                </p>
                <p className="mt-1 text-lg font-black leading-none text-primary">{progressPct}%</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold text-foreground">Counselling Journey</p>
                <span className="text-[11px] font-bold text-primary">{progressPct}% Complete</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                  style={{ width: sectionInView ? `${progressPct}%` : 0 }}
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {journey.map(s => (
                  <div
                    key={s.label}
                    className={`rounded-xl border px-2 py-2 text-center ${
                      s.done
                        ? 'border-success/30 bg-success-light text-success'
                        : 'border-border bg-background/70 text-foreground-subtle'
                    }`}
                  >
                    <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface">
                      {s.done ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                    </div>
                    <p className="truncate text-[10px] font-bold">{s.label}</p>
                    {s.label === 'Choices' && choiceListCount !== null && choiceListCount > 0 && (
                      <p className="mt-0.5 text-[9px] font-black">{choiceListCount}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-muted p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Stethoscope size={17} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
                  Target
                </p>
                <p className="truncate text-sm font-bold text-foreground">MBBS · Govt College</p>
              </div>
              <Link
                href="/dashboard/predictor"
                className="flex shrink-0 items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-[11px] font-bold text-primary"
              >
                Predict <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="mt-3 rounded-2xl border border-border bg-background/70 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Building2 size={15} className="text-primary" />
                  <p className="text-xs font-bold text-foreground">Top Picks for You</p>
                </div>
                <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary">
                  {TOP_PICKS.length} colleges
                </span>
              </div>
              <div className="space-y-1.5">
                {TOP_PICKS.slice(0, 3).map((college, index) => (
                  <div
                    key={college.name}
                    className={`flex items-center gap-2 rounded-xl border border-border bg-surface px-2.5 py-2 transition-all duration-700 ${
                      sectionInView ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                    }`}
                    style={{ transitionDelay: sectionInView ? `${index * 90}ms` : '0ms' }}
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-light text-[10px] font-black text-primary">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-foreground">{college.name}</p>
                      <p className="text-[9px] font-medium text-foreground-subtle">
                        {college.location} · Closing rank {college.rank.toLocaleString()}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${college.tagCls}`}>
                      {college.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    <div className="hidden sm:grid w-full grid-cols-[minmax(0,1fr)_320px] gap-4 items-stretch">

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
              <h1 className="text-2xl font-black text-foreground leading-tight">{displayName}</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs font-semibold bg-primary-light text-primary px-2.5 py-1 rounded-full">
                  {categoryBadge}
                </span>
                <span className="text-xs font-semibold bg-secondary-light text-secondary px-2.5 py-1 rounded-full">
                  NEET UG 2025
                </span>
                {/* dummy score — API not yet available */}
                <span className="text-xs text-foreground-subtle">Score: <b className="text-foreground">650</b></span>
              </div>
            </div>

            {/* dummy rank — API not yet available */}
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
              <span className="text-xs font-bold text-primary">{progressPct}% Complete</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                style={{ width: sectionInView ? `${progressPct}%` : 0 }}
              />
            </div>
            <div className="grid grid-cols-4 gap-1.5 mt-1">
              {journey.map(s => (
                <div key={s.label} className={`flex items-center gap-1 text-[11px] font-semibold ${s.done ? 'text-success' : 'text-foreground-subtle'}`}>
                  {s.done ? <CheckCircle2 size={11} /> : <Circle size={11} />}
                  {s.label}
                  {s.label === 'Choices' && choiceListCount !== null && choiceListCount > 0 && (
                    <span className="text-[9px] font-bold bg-primary-light text-primary px-1 rounded-full ml-0.5">
                      {choiceListCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* target row — dummy */}
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

      {/* RIGHT - top picks */}
      <div className="flex flex-col gap-3">
        <div className="h-full bg-surface border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Top Picks for You</h2>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary-light text-primary">
              {TOP_PICKS.length}
            </span>
          </div>
          {TOP_PICKS.map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 py-2.5 border-b border-border last:border-0 transition-all duration-700 ${
                sectionInView ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
              style={{ transitionDelay: sectionInView ? `${i * 90}ms` : '0ms' }}
            >
              <div className="w-6 h-6 rounded-lg bg-primary-light flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{c.name}</p>
                <p className="text-[10px] text-foreground-subtle">
                  {c.location} · Closing rank {c.rank.toLocaleString()}
                </p>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${c.tagCls}`}>{c.tag}</span>
            </div>
          ))}
          <Link href="/dashboard/colleges" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
            Explore colleges <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
