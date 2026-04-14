'use client';

import { BookOpen, GraduationCap, Stethoscope } from 'lucide-react';
import { PageShell } from '@/components/dashboard/PageShell';

const courses = [
  { name: 'MBBS', duration: '5.5 years', seats: 106345, type: 'UG' },
  { name: 'BDS', duration: '5 years', seats: 27868, type: 'UG' },
  { name: 'BAMS', duration: '5.5 years', seats: 52720, type: 'UG' },
  { name: 'BHMS', duration: '5.5 years', seats: 13130, type: 'UG' },
  { name: 'BUMS', duration: '5.5 years', seats: 4770, type: 'UG' },
  { name: 'B.V.Sc', duration: '5 years', seats: 9500, type: 'UG' },
];

const getIcon = (name: string) => {
  if (name === 'MBBS') return Stethoscope;
  if (name === 'BDS') return GraduationCap;
  return BookOpen;
};

export default function CoursesPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Header (Top Left) */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-foreground">
          Medical Courses
        </h1>
        <p className="text-[13px] text-foreground-muted mt-1 max-w-[520px]">
          Compare course duration, seat availability, and eligibility across
          MBBS, BDS, AYUSH, and allied programs to plan your NEET journey better.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
          const Icon = getIcon(c.name);

          return (
            <div
              key={c.name}
              className="group bg-card border border-border rounded-2xl p-5
              hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-foreground">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-foreground-subtle">
                      Undergraduate program
                    </p>
                  </div>
                </div>

                <span
                  className="text-[10px] font-semibold bg-primary-light text-primary
                  px-2 py-0.5 rounded-full"
                >
                  {c.type}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-foreground-muted">Duration</span>
                  <span className="font-medium text-foreground">
                    {c.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-foreground-muted">Total seats</span>
                  <span className="font-medium text-foreground">
                    {c.seats.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress bar (visual seats weight) */}
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${Math.min(c.seats / 110000 * 100, 100)}%`,
                  }}
                />
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-foreground-subtle">
                  NEET eligible
                </span>

                <span className="text-[11px] font-medium text-primary group-hover:underline">
                  View details →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}