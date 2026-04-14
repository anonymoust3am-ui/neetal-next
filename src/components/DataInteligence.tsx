import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const stats = [
  { value: "706+",     label: "Medical colleges",        sub: "Govt, private & deemed",     color: "text-primary",   dot: "bg-primary" },
  { value: "28",       label: "State counselling systems", sub: "All major states covered",   color: "text-secondary",   dot: "bg-secondary" },
  { value: "₹8K–₹25L", label: "Annual fee range",        sub: "Govt to private colleges",   color: "text-success",  dot: "bg-success" },
  { value: "4+",       label: "Counselling rounds",       sub: "Per authority per year",     color: "text-warning",   dot: "bg-warning" },
  { value: "50K+",     label: "Cutoff data points",       sub: "By rank, category & quota",  color: "text-error",     dot: "bg-error" },
  { value: "15+",      label: "Quota types",              sub: "AIQ, state, mgmt, NRI, more",color: "text-accent",      dot: "bg-accent" },
];

const capabilities = [
  {
    title: "State-wise seat matrix",
    desc: "Seats per college, course, quota, and category — updated every counselling year.",
    tags: ["Government", "Private", "Deemed", "AIIMS", "JIPMER"],
    border: "border-l-primary",
  },
  {
    title: "Round-wise cutoff history",
    desc: "Closing ranks for AIQ and state quotas across multiple years and rounds.",
    tags: ["AIQ", "State", "Category-wise", "Year-on-year"],
    border: "border-l-secondary",
  },
  {
    title: "Fee & bond comparison",
    desc: "Annual fees, total bond amount, bond years, stipend, and hostel — all in one view.",
    tags: ["Annual fees", "Bond amount", "Stipend", "Hostel"],
    border: "border-l-success",
  },
  {
    title: "Notice & deadline tracking",
    desc: "Official notices converted into plain-language summaries with action items.",
    tags: ["MCC", "State authorities", "Round-specific"],
    border: "border-l-warning",
  },
];

export function DataIntelligence() {
  return (
    <section className="py-24 bg-bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-start">
          {/* Stats */}
          <div className="flex flex-col gap-8">
            <SectionHeader
              eyebrow="Data intelligence"
              title="Real data. Not estimates."
              description="Neetell aggregates from official authorities — MCC, state DMEs, and college websites — into structured, filterable intelligence."
              size="md"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="bg-card rounded-lg border border-border p-5 shadow-sm flex flex-col gap-2">
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className={`font-bold text-2xl tabular-nums leading-none ${s.color}`}>{s.value}</span>
                  <span className="font-semibold text-sm text-foreground leading-snug">{s.label}</span>
                  <span className="text-xs text-foreground-muted">{s.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-foreground-muted uppercase tracking-[0.15em] mb-2">What data we cover</p>
            {capabilities.map((c) => (
              <div key={c.title} className={`bg-card rounded-lg border border-border border-l-4 ${c.border} p-5 shadow-sm hover:shadow-md transition-shadow`}>
                <p className="font-semibold text-base text-foreground mb-1.5">{c.title}</p>
                <p className="text-sm text-foreground-muted leading-relaxed mb-3">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-[11px] rounded-full bg-bg-secondary border border-border text-foreground-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}