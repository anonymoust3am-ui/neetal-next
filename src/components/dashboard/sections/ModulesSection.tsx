import Link from 'next/link';
import { ChevronRight, Target, TrendingUp, BarChart2, Grid3X3 } from 'lucide-react';

interface ActionCardProps {
  icon: React.ElementType;
  accent: string;
  label: string;
  desc: string;
  href: string;
  badge?: string;
}

function ActionCard({ icon: Icon, accent, label, desc, href, badge }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group relative bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-28 h-28 opacity-[0.05] rounded-bl-full" style={{ background: accent }} />
      <div className="absolute bottom-0 left-0 w-16 h-16 opacity-[0.04] rounded-tr-full" style={{ background: accent }} />

      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
          style={{ background: accent + '18' }}
        >
          <Icon size={22} style={{ color: accent }} />
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-light text-primary">
            {badge}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-xs text-foreground-muted mt-0.5 leading-snug">{desc}</p>
      </div>

      <div className="flex items-center gap-1 text-xs font-semibold mt-auto" style={{ color: accent }}>
        Open <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}

const MODULES: ActionCardProps[] = [
  { icon: Target,     accent: '#0d9488', label: 'College Predictor', desc: 'Check admission probability by rank & category', href: '/dashboard/predictor', badge: 'AI' },
  { icon: TrendingUp, accent: '#7c3aed', label: 'Rank Explorer',     desc: 'Compare your rank against closing ranks',         href: '/dashboard/rank'      },
  { icon: BarChart2,  accent: '#0ea5e9', label: 'Compare Colleges',  desc: 'Side-by-side fees, cutoff & facilities',          href: '/dashboard/compare'   },
  { icon: Grid3X3,    accent: '#d97706', label: 'Seat Matrix',       desc: 'Category-wise seat breakdown by college',         href: '/dashboard/seats'     },
];

export function ModulesSection() {
  return (
    <div>
      <h2 className="text-sm font-bold text-foreground mb-3">Tools & Modules</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {MODULES.map(m => <ActionCard key={m.href} {...m} />)}
      </div>
    </div>
  );
}
