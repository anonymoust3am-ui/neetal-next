'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CheckCircle2, Circle, Stethoscope, ArrowUpRight, UserCircle,
} from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { useAuth } from '@/contexts/AuthContext';
import { getChoiceLists } from '@/lib/api';

export function UserSection() {
  const { user, firebaseUser } = useAuth();
  const rank = useCountUp(2341, 1200);
  const [choiceListCount, setChoiceListCount] = useState<number | null>(null);

  useEffect(() => {
    if (!firebaseUser) return;
    firebaseUser.getIdToken()
      .then(token => getChoiceLists(token, { limit: 1 }))
      .then(r => setChoiceListCount(r.total))
      .catch(() => {});
  }, [firebaseUser]);

  /* dummy data — API doesn't support these yet */
  const TOP_PICKS = [
    { name: 'AIIMS Bhopal',      tag: 'Safe',   tagCls: 'bg-success-light text-success',     rank: 890  },
    { name: 'JIPMER Puducherry', tag: 'Target', tagCls: 'bg-primary-light text-primary',     rank: 512  },
    { name: 'MAMC Delhi',        tag: 'Target', tagCls: 'bg-primary-light text-primary',     rank: 1240 },
    { name: 'Kasturba Manipal',  tag: 'Dream',  tagCls: 'bg-secondary-light text-secondary', rank: 290  },
  ];

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
    <div className="space-y-4 pt-8">
      {!user?.isProfileComplete && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30">
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
                style={{ width: `${progressPct}%` }}
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

      {/* RIGHT — top picks (dummy) */}
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
