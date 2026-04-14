'use client';

import Link from 'next/link';
import { Newspaper, ArrowUpRight } from 'lucide-react';

interface UpdateRowProps {
  tag: string;
  title: string;
  time: string;
  color: string;
}

function UpdateRow({ tag, title, time, color }: UpdateRowProps) {
  return (
    <div className="group relative flex items-start gap-3 py-3 px-2 rounded-xl hover:bg-muted transition-colors">

      {/* timeline dot + line */}
      <div className="relative flex flex-col items-center mt-1.5">
        <span
          className="h-2.5 w-2.5 rounded-full ring-4 ring-background"
          style={{ backgroundColor: color }}
        />
        <span className="w-px flex-1 bg-border mt-1 opacity-60" />
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">

        {/* tag */}
        <span
          className="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full mb-1"
          style={{
            backgroundColor: color + '15',
            color: color,
          }}
        >
          {tag}
        </span>

        {/* title */}
        <p className="text-xs font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
          {title}
        </p>

        {/* meta */}
        <p className="text-[10px] text-foreground-subtle mt-0.5">
          {time}
        </p>
      </div>
    </div>
  );
}

const UPDATES: UpdateRowProps[] = [
  {
    tag: 'MCC',
    color: '#0d9488',
    title: 'MCC releases Round 2 schedule — key dates announced',
    time: '2 hrs ago',
  },
  {
    tag: 'AIIMS',
    color: '#7c3aed',
    title: 'AIIMS stray vacancy round eligibility criteria updated',
    time: '5 hrs ago',
  },
  {
    tag: 'State',
    color: '#0ea5e9',
    title: 'Maharashtra state counselling registration starts April 20',
    time: 'Yesterday',
  },
  {
    tag: 'Fees',
    color: '#d97706',
    title: 'Kasturba Medical College revises fee structure for 2025 batch',
    time: '2 days ago',
  },
  {
    tag: 'Policy',
    color: '#16a34a',
    title: 'NMC issues new guidelines for deemed university admissions',
    time: '3 days ago',
  },
];

export function NerdUpdates() {
  return (
    <div className="relative bg-card border border-border rounded-2xl shadow-sm overflow-hidden">

      {/* subtle glow background (theme-native) */}
      <div className="absolute -top-16 -right-16 h-40 w-40 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative p-5">

        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Newspaper size={14} />
            </div>

            <h2 className="text-sm font-bold text-foreground">
              Latest Updates
            </h2>
          </div>

          <Link
            href="#"
            className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1"
          >
            View all
            <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* list */}
        <div className="space-y-1">
          {UPDATES.map((u, i) => (
            <UpdateRow key={i} {...u} />
          ))}
        </div>
      </div>
    </div>
  );
}