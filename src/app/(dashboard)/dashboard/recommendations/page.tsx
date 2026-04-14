import { Star } from 'lucide-react';
import { PageShell } from '@/components/dashboard/PageShell';

const groups = [
  {
    tag: 'Safe', tagCls: 'bg-success-light text-success', border: 'border-success/20',
    colleges: ['AIIMS Patna', 'JIPMER Puducherry', 'Maulana Azad Medical College'],
  },
  {
    tag: 'Target', tagCls: 'bg-warning-light text-warning', border: 'border-warning/20',
    colleges: ['AIIMS Bhopal', 'VMMC & Safdarjung Hospital', 'AIIMS Rishikesh'],
  },
  {
    tag: 'Dream', tagCls: 'bg-primary-light text-primary', border: 'border-primary/20',
    colleges: ['AIIMS New Delhi', 'AIIMS Mumbai', 'PGIMER Chandigarh'],
  },
];

export default function RecommendationsPage() {
  return (
    <PageShell
      title="Recommendations"
      description="Personalised Safe · Target · Dream colleges based on your rank"
      icon={Star}
      accent="#7c3aed"
      badge="AI Curated"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {groups.map(g => (
          <div key={g.tag} className={`bg-surface border ${g.border} border-border rounded-2xl p-5 shadow-sm`}>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${g.tagCls}`}>{g.tag}</span>
            <ul className="mt-4 space-y-2.5">
              {g.colleges.map(c => (
                <li key={c} className="flex items-start gap-2.5 text-sm">
                  <span className="w-5 h-5 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle" />
                  </span>
                  <span className="text-foreground font-medium leading-snug">{c}</span>
                </li>
              ))}
            </ul>
            <button disabled className="mt-4 w-full h-8 rounded-xl bg-muted border border-border text-xs font-medium text-foreground-muted cursor-not-allowed">
              View Details
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-foreground-subtle mt-4">Based on NEET 2024 closing ranks. Update your profile rank for accurate suggestions.</p>
    </PageShell>
  );
}
