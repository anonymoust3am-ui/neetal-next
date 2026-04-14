import Link from 'next/link';
import { ArrowUpRight, Building2, TrendingDown, Banknote, Bot } from 'lucide-react';

interface InsightCardProps {
  icon: React.ElementType;
  accent: string;
  label: string;
  value: string;
  sub: string;
  cta: string;
  href: string;
}

function InsightCard({ icon: Icon, accent, label, value, sub, cta, href }: InsightCardProps) {
  return (
    <div className="relative bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:shadow-lg hover:border-primary/30 transition-all duration-200 overflow-hidden">
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-[0.08]" style={{ background: accent }} />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accent + '15' }}>
        <Icon size={18} style={{ color: accent }} />
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-foreground-subtle mb-1">{label}</p>
        <p className="text-2xl font-black text-foreground leading-none tabular-nums">{value}</p>
        <p className="text-xs text-foreground-muted mt-1 leading-snug">{sub}</p>
      </div>
      <Link href={href} className="flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: accent }}>
        {cta} <ArrowUpRight size={12} />
      </Link>
    </div>
  );
}

export function InsightsSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-foreground">Personalized Insights</h2>
        <span className="text-xs text-foreground-subtle">Updated 2 min ago</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <InsightCard icon={Building2}    accent="#0d9488" label="Best Matches" value="78"    sub="colleges within your rank range"              cta="View colleges" href="/dashboard/colleges"        />
        <InsightCard icon={TrendingDown} accent="#7c3aed" label="Cutoff Gap"   value="+280"  sub="ranks above closing rank at AIIMS Bhopal"     cta="Check cutoffs" href="/dashboard/cutoffs"         />
        <InsightCard icon={Banknote}     accent="#0ea5e9" label="Avg Fees"     value="₹1.4L" sub="per year across your shortlisted colleges"    cta="Fee details"   href="/dashboard/fees"            />
        <InsightCard icon={Bot}          accent="#d97706" label="AI Score"     value="8.4/10" sub="admission probability for top picks"         cta="AI analysis"   href="/dashboard/recommendations" />
      </div>
    </div>
  );
}
