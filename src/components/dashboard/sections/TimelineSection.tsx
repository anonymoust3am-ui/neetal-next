import Link from 'next/link';
import { ChevronRight, CheckCircle2, Circle, Bot, Zap } from 'lucide-react';

// ── Timeline Step ─────────────────────────────────────────────────────────────
function TimelineStep({ done, active, label, date, sub }: {
  done: boolean; active: boolean; label: string; date: string; sub: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col items-center">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
          done   ? 'bg-success border-success' :
          active ? 'bg-primary border-primary scale-110 shadow-[0_0_0_4px_rgba(13,148,136,0.15)]' :
                   'bg-muted border-border'
        }`}>
          {done   ? <CheckCircle2 size={14} className="text-white" /> :
           active ? <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" /> :
                    <Circle size={14} className="text-foreground-subtle" />}
        </div>
        <div className="w-[1.5px] flex-1 mt-1 min-h-[28px] bg-border" />
      </div>
      <div className="pb-5">
        <p className={`text-sm font-semibold ${active ? 'text-primary' : done ? 'text-foreground' : 'text-foreground-muted'}`}>
          {label}
          {active && (
            <span className="ml-1.5 text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">NOW</span>
          )}
        </p>
        <p className={`text-xs mt-0.5 ${active ? 'text-foreground-muted' : 'text-foreground-subtle'}`}>{date}</p>
        <p className="text-[11px] text-foreground-subtle mt-0.5 leading-snug">{sub}</p>
      </div>
    </div>
  );
}

const STEPS = [
  { done: true,  active: false, label: 'Round 1 Registration',  date: 'Mar 10 – Mar 18', sub: 'Verification & payment completed'       },
  { done: true,  active: false, label: 'Round 1 Allotment',     date: 'Mar 22',          sub: 'Results published on MCC portal'        },
  { done: false, active: true,  label: 'Round 2 Registration',  date: 'Apr 15 – Apr 18', sub: 'Open now — complete before deadline'    },
  { done: false, active: false, label: 'Round 2 Allotment',     date: 'Apr 22',          sub: 'Seat allotment letter download'          },
  { done: false, active: false, label: 'Stray Vacancy',         date: 'May 20 – May 24', sub: 'Final round for remaining seats'        },
];

const CHECKLIST = [
  { label: 'Add AIR to profile',         done: true  },
  { label: 'Verify category documents',  done: true  },
  { label: 'Build shortlist (min 10)',   done: true  },
  { label: 'Order choice list',          done: false },
  { label: 'Lock & submit choices',      done: false },
  { label: 'Download allotment letter',  done: false },
];

const TOP_PICKS = [
  { name: 'AIIMS Bhopal',       tag: 'Safe',   tagCls: 'bg-success-light text-success',     rank: 890  },
  { name: 'JIPMER Puducherry',  tag: 'Target', tagCls: 'bg-primary-light text-primary',     rank: 512  },
  { name: 'MAMC Delhi',         tag: 'Target', tagCls: 'bg-primary-light text-primary',     rank: 1240 },
  { name: 'Kasturba Manipal',   tag: 'Dream',  tagCls: 'bg-secondary-light text-secondary', rank: 290  },
];

export function TimelineSection() {
  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">

      {/* timeline + checklist */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-foreground">Counselling Timeline</h2>
          <Link href="/dashboard/counselling" className="text-xs text-primary font-semibold flex items-center gap-0.5">
            View all <ChevronRight size={11} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-3">MCC · AIQ Round</p>
            {STEPS.map((s, i) => <TimelineStep key={i} {...s} />)}
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-3">Your Checklist</p>
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 border-b border-border last:border-0">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-success' : 'bg-muted border border-border'}`}>
                  {item.done && <CheckCircle2 size={11} className="text-white" />}
                </div>
                <p className={`text-xs ${item.done ? 'text-foreground-muted line-through' : 'text-foreground font-medium'}`}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>


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
        <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-foreground">My Shortlist</h2>
            <Link href="/dashboard/shortlist" className="text-xs text-primary font-semibold">Manage</Link>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-2xl font-black text-foreground">18</p>
              <p className="text-xs text-foreground-subtle">Colleges saved</p>
            </div>
            <div className="h-8 w-[1px] bg-border" />
            <div>
              <p className="text-base font-bold text-foreground">₹8.2L</p>
              <p className="text-xs text-foreground-subtle">Avg annual fees</p>
            </div>
            <div className="h-8 w-[1px] bg-border" />
            <div>
              <p className="text-base font-bold text-foreground">7</p>
              <p className="text-xs text-foreground-subtle">Govt colleges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
