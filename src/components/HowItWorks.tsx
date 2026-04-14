import React from "react";
import { Search, SlidersHorizontal, GitCompare, Bookmark, Send } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const steps = [
  { n: "01", icon: Search,           label: "Enter your profile",     desc: "Rank, category, domicile, budget, and preferences like government/private.",  color: "text-primary", bg: "bg-primary/5 border-primary/20", dot: "bg-primary" },
  { n: "02", icon: SlidersHorizontal, label: "Filter & explore",      desc: "Browse state-aware results filtered by quota, fees, bond, and college type.",  color: "text-secondary", bg: "bg-secondary/5 border-secondary/20", dot: "bg-secondary" },
  { n: "03", icon: GitCompare,        label: "Compare options",        desc: "Place colleges in the compare tray — see fees, bond, cutoffs, and rank data.", color: "text-warning", bg: "bg-warning/5 border-warning/20", dot: "bg-warning" },
  { n: "04", icon: Bookmark,          label: "Build your shortlist",   desc: "Save to Safe, Target, or Dream buckets with data-backed explanations.",       color: "text-success", bg: "bg-success/5 border-success/20", dot: "bg-success" },
  { n: "05", icon: Send,              label: "Get expert strategy",    desc: "Upgrade to premium counselling and finalise your choice list with an expert.", color: "text-error",   bg: "bg-error/5 border-error/20", dot: "bg-error" },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="From rank to right college — with clarity"
          description="Neetell structures your decision process into clear, guided steps rather than leaving you with raw data and no direction."
          align="center"
          className="mb-14"
        />

        {/* Desktop: horizontal flow */}
        <div className="hidden lg:grid grid-cols-5 gap-4 relative">
          {/* Connector line */}
          <div className="absolute top-[2.25rem] left-[10%] right-[10%] h-px bg-gradient-to-r from-primary/30 via-secondary/30 via-warning/30 to-error/30 z-0" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.n} className="relative z-10 flex flex-col items-center text-center gap-4 p-5">
                {/* Step icon */}
                <div className="relative bg-card">
                  <div className={cn("w-[4.5rem] h-[4.5rem] rounded-xl flex items-center justify-center border-2 bg-card shadow-sm", step.bg, step.color)}>
                    <Icon size={26} />
                  </div>
                  <span className={cn("absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white", step.dot)}>
                    {step.n.replace("0", "")}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-sm text-foreground leading-snug">{step.label}</p>
                  <p className="text-xs text-foreground-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical list */}
        <div className="flex flex-col gap-4 lg:hidden">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.n} className="flex gap-4 p-5 rounded-lg border border-border bg-card shadow-sm">
                <div className="relative flex-shrink-0">
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center border", step.bg, step.color)}>
                    <Icon size={22} />
                  </div>
                  <span className={cn("absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white", step.dot)}>
                    {i + 1}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="font-semibold text-sm text-foreground">{step.label}</p>
                  <p className="text-xs text-foreground-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}