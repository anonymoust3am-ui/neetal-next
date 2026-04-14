import React from "react";
import { AiOutlineYoutube } from "react-icons/ai";

import { AlertTriangle,  Hash, FileQuestion, Clock, Shuffle } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const painPoints = [
  {
    icon: AlertTriangle,
    title: "Too many conflicting sources",
    desc: "YouTube videos, Telegram groups, and random websites give different information for the same rank.",
  },
  {
    icon: FileQuestion,
    title: "Notices are dense and confusing",
    desc: "Official counselling PDFs run into hundreds of pages. Critical deadlines get buried in jargon.",
  },
  {
    icon: Shuffle,
    title: "Quota and state eligibility is unclear",
    desc: "Students miss state quota opportunities because domicile and eligibility rules aren't explained clearly.",
  },
  {
    icon: Hash,
    title: "Rank vs realistic option gap",
    desc: "Students either aim too low or waste choices on colleges well beyond their rank range.",
  },
  {
    icon: Clock,
    title: "Deadlines arrive without warning",
    desc: "Round registrations, choice filling, and document uploads have tight windows that students miss.",
  },
  {
    icon: AiOutlineYoutube,
    title: "Overreliance on opinion, not data",
    desc: "Major financial decisions get made based on influencer opinions rather than verified cutoff trends.",
  },
];

export function PainSection() {
  return (
    <section className="py-24 bg-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          {/* Left: text */}
          <div className="flex flex-col gap-8">
            <SectionHeader
              eyebrow="The real problem"
              title={
                <>
                  Why counselling feels{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">overwhelming</span>
                </>
              }
              description="NEET counselling involves lakhs of rupees, a decade-long career decision, and a high-pressure timeline. Yet most students navigate it with scattered information and no structured support."
              size="md"
            />

            <div className="flex flex-col gap-3">
              <div className="bg-error-light/10 border border-error/20 rounded-xl p-5">
                <p className="text-base text-foreground leading-relaxed">
                  <span className="font-semibold text-error">60%+ of students</span> with good ranks
                  still make poor choice-filling decisions due to lack of structured, state-aware guidance.
                </p>
              </div>
              <div className="bg-warning-light/10 border border-warning/20 rounded-xl p-5">
                <p className="text-base text-foreground leading-relaxed">
                  <span className="font-semibold text-warning">Bond obligations and fee structures</span> are
                  often discovered only after admission — too late to reconsider.
                </p>
              </div>
            </div>
          </div>

          {/* Right: pain cards */}
          <div className="grid sm:grid-cols-2 gap-3">
            {painPoints.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-bg-secondary border border-border text-foreground-muted flex-shrink-0">
                  <Icon size={16} />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-foreground-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}