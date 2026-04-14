'use client';
import Link from 'next/link';

interface AnnouncementItemProps {
  title: string;
  body: string;
  href: string;
  date: string;
}

function AnnouncementCard({ title, body, href, date }: AnnouncementItemProps) {
  return (
    <div className="group bg-card border border-border hover:border-blue-300 rounded-xl p-[18px] flex flex-col gap-2 transition-colors duration-150">
      {/* date row */}
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-primary flex-shrink-0" />
        <span className="text-[11px] font-medium tracking-wide text-foreground-muted uppercase">
          {date}
        </span>
      </div>

      {/* title */}
      <h3 className="text-[18px] font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-150 line-clamp-2">
        {title}
      </h3>

      {/* body */}
      <p className="text-s text-foreground-muted leading-relaxed line-clamp-2 flex-1 pr-25">
        {body}
      </p>

      {/* link */}
      <Link
        href={href}
        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
      >
        View details
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </Link>
    </div>
  );
}

const ANNOUNCEMENTS: AnnouncementItemProps[] = [
  {
    title: 'MCC Round 2 registration closes on April 18, 2026',
    body: 'Candidates must complete choice filling and document verification before the deadline. Missing this step will disqualify participation in Round 2 counselling process.',
    date: '18 Apr 2026',
    href: '/dashboard/counselling',
  },
  {
    title: 'Choice filling window opens for NEET UG counselling',
    body: 'Students can arrange, modify, and lock their preferences within the official counselling portal before final submission.',
    date: '20 Apr 2026',
    href: '/dashboard/choices',
  },
  {
    title: 'AIIMS stray vacancy round schedule released',
    body: 'Stray vacancy round will allow upgraded candidates from previous rounds to participate based on eligibility criteria.',
    date: '22 Apr 2026',
    href: '/dashboard/allotment',
  },
  {
    title: 'JIPMER Round 2 allotment results published',
    body: 'Candidates can download their allotment letter and proceed with reporting at allotted institutions.',
    date: '10 Apr 2026',
    href: '/dashboard/allotment',
  },
];

export function AnnouncementsSection() {
  return (
    <div className="bg-muted border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* header */}
      <div className="px-5 py-[18px] border-b border-border flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[23px] font-bold text-foreground leading-snug">
            Announcements
          </h2>
          <p className="text-xs text-foreground-muted mt-0.5">
            Official counselling notices and updates
          </p>
        </div>
        <span className="flex-shrink-0 mt-0.5 bg-info-light text-info text-[11px] font-medium px-2.5 py-1 rounded-full">
          {ANNOUNCEMENTS.length} active
        </span>
      </div>

      {/* cards float as white surfaces on the muted canvas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3">
        {ANNOUNCEMENTS.map((item, i) => (
          <AnnouncementCard key={i} {...item} />
        ))}
      </div>

      {/* footer */}
      <div className="px-5 py-3 border-t border-border flex justify-end">
        <Link
          href="/dashboard/announcements"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
        >
          View all announcements
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}