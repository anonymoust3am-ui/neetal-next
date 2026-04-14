import Link from 'next/link';
import { Star, Zap } from 'lucide-react';

const RANK_ROWS = [
  { name: 'AIIMS New Delhi',   cut: 49,   myRank: 2341 },
  { name: 'AIIMS Bhopal',      cut: 890,  myRank: 2341 },
  { name: 'JIPMER Puducherry', cut: 512,  myRank: 2341 },
  { name: 'MAMC Delhi',        cut: 1240, myRank: 2341 },
];

function RankBar({ name, cut, myRank }: { name: string; cut: number; myRank: number }) {
  const within = myRank <= cut;
  const pct    = Math.min((cut / myRank) * 50, 95);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-foreground">{name}</p>
        <span className={`text-[10px] font-bold ${within ? 'text-success' : 'text-error'}`}>
          {within ? '✓ Within range' : `${(myRank - cut).toLocaleString()} above cutoff`}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: within ? '#16a34a' : '#0d9488' }}
        />
        <div className="absolute top-0 bottom-0 w-0.5 bg-error/60" style={{ left: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-foreground-subtle mt-0.5">
        Cutoff: {cut.toLocaleString()} · Your rank: {myRank.toLocaleString()}
      </p>
    </div>
  );
}

export function RankInsightSection() {
  return (
    <div className="grid sm:grid-cols-2 gap-3">

      {/* rank vs cutoff */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-foreground">Your Rank vs Cutoffs</h2>
          <Link href="/dashboard/rank" className="text-xs text-primary font-semibold">Full analysis</Link>
        </div>
        <div className="space-y-4">
          {RANK_ROWS.map(r => <RankBar key={r.name} {...r} />)}
        </div>
      </div>

      {/* premium CTA */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 shadow-md flex flex-col justify-between"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(13,148,136,0.6) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(124,58,237,0.6) 0%, transparent 50%)',
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Star size={15} className="text-yellow-400" fill="currentColor" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Premium</span>
          </div>
          <p className="text-xl font-black text-white leading-tight mb-1">
            Unlock Full<br />Counselling Suite
          </p>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            AI choice builder, unlimited predictions, expert 1-on-1 sessions & priority alerts.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/expert"
              className="flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors"
              style={{ boxShadow: '0 4px 16px rgba(13,148,136,0.4)' }}
            >
              <Zap size={13} /> Upgrade Now
            </Link>
            <Link href="/dashboard/expert" className="text-[11px] text-white/40 text-center hover:text-white/60 transition-colors">
              Book a free expert session →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
