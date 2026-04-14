'use client';
import { Flame, TrendingUp, GraduationCap, CalendarClock } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  sub: string;
  icon: React.ElementType;
  accent: string;
}
function StatCard({ label, value, unit, sub, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="relative h-50 bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200">
      <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-[40px] opacity-[0.06]" style={{ background: accent }} />
      <div className="flex items-start justify-between">
        <p className="text-[18px] font-bold uppercase tracking-widest text-foreground">{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: accent + '18' }}>
          <Icon size={16} style={{ color: accent }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-black text-foreground leading-none tabular-nums">
          {value}
          {unit && <span className="text-m font-semibold text-foreground-muted ml-1">{unit}</span>}
        </p>
        <p className="text-xs text-foreground-subtle mt-1.5">{sub}</p>
      </div>
    </div>
  );
}
export function StatsSection() {
  const score    = useCountUp(650,  1000);
  const rank     = useCountUp(2341, 1200);
  const colleges = useCountUp(147,  1000);
  const days     = useCountUp(12,   800);
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard label="NEET Score" value={score}              unit="/720"   sub="90.4th Percentile"       icon={Flame}         accent="
#0d9488" />
      <StatCard label="AIR"        value={rank.toLocaleString()}            sub="General Category · AIQ"  icon={TrendingUp}    accent="
#7c3aed" />
      <StatCard label="Eligible"   value={colleges}           unit=" clg"   sub="Across all categories"   icon={GraduationCap} accent="
#0ea5e9" />
      <StatCard label="Deadline"   value={days}               unit="d left" sub="MCC Round 2 closes"      icon={CalendarClock} accent="
#d97706" />
    </div>
  );
}