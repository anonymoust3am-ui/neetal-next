import React from "react";
import Link from "next/link";
import { Cpu, GitCompare, Bell, Bookmark, MapPin, FileText, ArrowRight, CheckCircle } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Cpu,       title: "College Predictor",        desc: "Enter rank, category, and quota. Get Safe / Target / Dream classified options with data-backed reasoning.", href: "/predictors/college",
    badge: "AI-powered", badgeColor: "bg-primary/10 text-primary",
    highlights: ["Category-aware", "State + AIQ", "Multi-round data"],
    accent: "hover:border-primary/30",
  },
  {
    icon: GitCompare, title: "Side-by-side Compare",    desc: "Compare up to 4 colleges across fees, bond, stipend, hostel, cutoffs and seat matrix in one structured view.", href: "/compare",
    badge: null,
    highlights: ["Up to 4 colleges", "10+ parameters", "Export ready"],
    accent: "hover:border-secondary/30",
  },
  {
    icon: Bell,       title: "Alerts & Deadlines",       desc: "Never miss round registration, choice filling windows, or allotment results. Notices translated into action items.", href: "/updates",
    badge: "Live", badgeColor: "bg-success/10 text-success",
    highlights: ["Push alerts", "Round-specific", "Plain language"],
    accent: "hover:border-success/30",
  },
  {
    icon: Bookmark,   title: "Saved Shortlist",          desc: "Save and organise colleges into a personal shortlist. Share with parents or your counsellor for review.", href: "/dashboard/shortlist",
    badge: null,
    highlights: ["Smart buckets", "Parent sharing", "Choice export"],
    accent: "hover:border-warning/30",
  },
  {
    icon: MapPin,     title: "State Counselling Guide",  desc: "Detailed state-wise guidance: authority, eligibility, domicile rules, important dates, and colleges.", href: "/counselling/states",
    badge: null,
    highlights: ["28 states", "Domicile-aware", "Eligibility clear"],
    accent: "hover:border-accent/30",
  },
  {
    icon: FileText,   title: "Choice Filling Strategy",  desc: "Build an optimal choice list with guidance on ordering, backup options, and quota strategy.", href: "/counselling/choice",
    badge: "Premium", badgeColor: "bg-secondary/10 text-secondary",
    highlights: ["Expert reviewed", "Quota strategy", "Risk analysis"],
    accent: "hover:border-error/30",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-24 bg-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Platform features"
          title="Every tool you need. Nothing you don't."
          description="Built specifically for NEET counselling — not a generic college portal retrofitted for medical admissions."
          align="center"
          className="mb-14"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.title}
                href={f.href}
                className={cn(
                  "group flex flex-col gap-5 p-6 rounded-lg border border-border bg-card transition-all duration-250",
                  "hover:shadow-md hover:-translate-y-1",
                  f.accent
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <span className="w-12 h-12 rounded-lg bg-bg-secondary border border-border flex items-center justify-center text-foreground-muted group-hover:text-foreground transition-colors">
                    <Icon size={22} />
                  </span>
                  {f.badge && (
                    <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full", f.badgeColor)}>
                      {f.badge}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="font-semibold text-base text-foreground">{f.title}</h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">{f.desc}</p>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-3">
                  {f.highlights.map((h) => (
                    <span key={h} className="flex items-center gap-1 text-xs text-foreground-muted">
                      <CheckCircle size={11} className="text-success flex-shrink-0" /> {h}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all duration-200">
                  Explore <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}