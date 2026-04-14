"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Shield, BarChart2, Clock, Zap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["General", "OBC-NCL", "SC", "ST", "EWS", "PH"];
const quotas      = ["All India (AIQ)", "State Quota", "Management Quota", "NRI Quota"];

const demoCards = [
  { college: "AIIMS New Delhi",       rank: "42,815", bucket: "dream",  tag: "Dream",   fees: "₹1,628/yr" },
  { college: "MAMC, New Delhi",       rank: "58,340", bucket: "target", tag: "Target",  fees: "₹7,200/yr" },
  { college: "VMMC & Safdarjung",     rank: "89,622", bucket: "safe",   tag: "Safe",    fees: "₹5,000/yr" },
];

export function HeroSection() {
  const [rank, setRank]         = useState("");
  const [category, setCategory] = useState("General");
  const [quota, setQuota]       = useState("All India (AIQ)");

  return (
    <section className="relative overflow-hidden bg-bg-primary min-h-[94vh] flex items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large blur blob top-right */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle at 60% 40%, rgba(13,148,136,0.12) 0%, rgba(124,58,237,0.07) 40%, transparent 70%)" }} />
        {/* Accent blob bottom-left */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 65%)" }} />
        {/* Dot pattern */}
        <div className="absolute inset-0 dot-grid opacity-40" />
        {/* Horizontal rule accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: Content ─────────────────────────────────── */}
          <div className="flex flex-col gap-7">

            {/* Eyebrow badge */}
            <div className="flex items-center gap-3 animate-fade-up">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                NEET UG 2025 · Round 2 Active
              </span>
              <span className="hidden sm:flex items-center gap-1 text-xs text-foreground-muted">
                <Clock size={11} />
                Choice filling closes Apr 13
              </span>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-3 animate-fade-up delay-75">
              <h1 className="font-sans font-bold tracking-tight leading-[1.05] text-[1.5rem] md:text-[1.5rem] lg:text-[2.5rem] xl:text-[3rem]">
                <span className="text-foreground block">Make smarter</span>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">NEET counselling</span>
                <span className="text-foreground block">decisions.</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-foreground-muted leading-relaxed max-w-lg animate-fade-up delay-150">
              Rank-aware. State-aware. Data-backed. Explore realistic college options,
              compare fees &amp; bonds, and navigate AIQ + state counselling — all in one place.
            </p>

            {/* Search panel */}
            <div className="bg-card rounded-xl p-4 md:p-5 shadow-md border border-border animate-fade-up delay-200">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-widest mb-3.5 flex items-center gap-2">
                <Zap size={12} className="text-accent" /> Find colleges for your NEET rank
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* Rank */}
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                  <input
                    type="number"
                    placeholder="Enter your rank  (e.g. 45000)"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    className="w-full h-11 px-9 text-sm rounded-lg bg-input border border-border focus:border-border-focus focus:outline-none text-foreground placeholder:text-foreground-subtle"
                    min={1}
                  />
                </div>
                {/* Category */}
                <div className="relative">
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full sm:w-32 h-11 px-3 pr-8 text-sm rounded-lg bg-input border border-border focus:border-border-focus focus:outline-none text-foreground appearance-none cursor-pointer">
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                </div>
                {/* Quota */}
                <div className="relative">
                  <select value={quota} onChange={(e) => setQuota(e.target.value)}
                    className="w-full sm:w-40 h-11 px-3 pr-8 text-sm rounded-lg bg-input border border-border focus:border-border-focus focus:outline-none text-foreground appearance-none cursor-pointer">
                    {quotas.map((q) => <option key={q}>{q}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                </div>
                {/* CTA */}
                <Link
                  href={`/predictors/college${rank ? `?rank=${rank}&category=${category}` : ""}`}
                  className="flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-primary hover:bg-primary-hover active:bg-primary-hover text-primary-foreground text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap flex-shrink-0"
                >
                  Predict <ArrowRight size={15} />
                </Link>
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2 mt-3.5 pt-3.5 border-t border-border">
                <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider self-center">Quick:</span>
                {["Govt. only", "No bond", "Under ₹5L/yr", "AIIMS/JIPMER", "State quota"].map((f) => (
                  <button key={f} className="px-2.5 py-0.5 text-[11px] rounded-full bg-bg-secondary border border-border hover:border-primary/50 text-foreground-muted hover:text-foreground transition-colors">
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-5 animate-fade-up delay-300">
              {[
                { icon: Shield,    text: "Official data only" },
                { icon: BarChart2, text: "50K+ cutoff records" },
                { icon: Clock,     text: "Updated every round" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-sm text-foreground-muted">
                  <Icon size={13} className="text-primary" /> {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Demo college cards ──────────────────────── */}
          <div className="hidden lg:flex flex-col gap-3 animate-slide-in-right delay-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-widest">
                Sample results · Rank 45,200 · General · AIQ
              </p>
              <Link href="/predictors/college" className="text-xs text-primary hover:text-primary-hover font-semibold flex items-center gap-1">
                Try predictor <ArrowRight size={11} />
              </Link>
            </div>

            {demoCards.map((card, i) => (
              <DemoCollegeCard key={card.college} {...card} delay={i * 100} />
            ))}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { value: "706+",  label: "Colleges",   color: "bg-primary" },
                { value: "28",    label: "States",     color: "bg-secondary" },
                { value: "50K+",  label: "Cutoffs",    color: "bg-success" },
              ].map(({ value, label, color }) => (
                <div key={label} className="bg-card rounded-lg p-3.5 border border-border shadow-sm text-center">
                  <div className={cn("w-1.5 h-1.5 rounded-full mx-auto mb-2", color)} />
                  <p className="font-sans font-bold text-xl text-foreground tabular-nums">{value}</p>
                  <p className="text-[11px] text-foreground-muted font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoCollegeCard({
  college, rank, bucket, tag, fees, delay,
}: {
  college: string; rank: string; bucket: string; tag: string; fees: string; delay: number;
}) {
  const tagStyles: Record<string, string> = {
    safe:   "bg-success-light text-success",
    target: "bg-warning-light text-warning",
    dream:  "bg-secondary-light text-secondary",
  };
  const dotStyles: Record<string, string> = {
    safe: "bg-success", target: "bg-warning", dream: "bg-secondary",
  };
  return (
    <div
      className="bg-card rounded-lg px-4 py-3.5 border border-border shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-up"
      style={{ animationDelay: `${delay + 300}ms` }}
    >
      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", dotStyles[bucket])} />
      <div className="flex-1 min-w-0">
        <p className="font-sans font-semibold text-sm text-foreground truncate">{college}</p>
        <p className="text-[11px] text-foreground-muted mt-0.5">MBBS · Fees: {fees}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", tagStyles[bucket])}>{tag}</span>
        <span className="font-sans font-bold text-sm text-foreground tabular-nums">#{rank}</span>
      </div>
    </div>
  );
}