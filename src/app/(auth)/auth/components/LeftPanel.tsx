'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { BookOpen, Award, GraduationCap, Brain, Zap } from 'lucide-react';
import Link from 'next/link';

const SLIDES = [
  {
    bg: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
    Icon: GraduationCap,
    eyebrow: '2 Lakh+ Students',
    title: 'Ace Your Medical Exams with Confidence',
    desc: "India's most trusted platform for NEET UG, NEET PG, INI-CET & more.",
    stat: { value: '2L+', label: 'Active Aspirants' },
  },
  {
    bg: 'linear-gradient(135deg, #059669 0%, #0891b2 50%, #0e7490 100%)',
    Icon: BookOpen,
    eyebrow: 'Comprehensive Content',
    title: '10,000+ Practice Questions Across All Subjects',
    desc: 'Expert-curated content covering every topic from Anatomy to Pathology.',
    stat: { value: '10K+', label: 'Practice Questions' },
  },
  {
    bg: 'linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #e11d48 100%)',
    Icon: Award,
    eyebrow: 'National Rankings',
    title: 'Test Yourself Against the Best in India',
    desc: 'Full-length mock tests with all-India rankings and detailed performance reports.',
    stat: { value: '#1', label: 'Ranked Platform' },
  },
  {
    bg: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #c026d3 100%)',
    Icon: Brain,
    eyebrow: 'AI-Powered Analytics',
    title: 'Personalised Study Plans Just for You',
    desc: 'Identify weak areas, track progress, and get smart AI recommendations.',
    stat: { value: '94%', label: 'Student Satisfaction' },
  },
];

export default function LeftPanel() {
  return (
    <aside className="hidden lg:block lg:w-[44%] xl:w-[42%] flex-shrink-0">
      <style>{`
        .auth-swiper { height: 100vh; width: 100%; }
        .auth-swiper .swiper-pagination { bottom: 28px; }
        .auth-swiper .swiper-pagination-bullet {
          background: rgba(255,255,255,0.45);
          width: 8px; height: 8px; opacity: 1;
          transition: all 0.3s ease;
        }
        .auth-swiper .swiper-pagination-bullet-active {
          background: #fff;
          width: 26px;
          border-radius: 4px;
        }
        .auth-swiper .swiper-slide { height: 100%; }
      `}</style>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="auth-swiper"
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="h-full w-full flex flex-col justify-between p-10 xl:p-14 relative overflow-hidden"
              style={{ background: slide.bg }}
            >
              {/* Blobs */}
              <span className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
              <span className="absolute -bottom-32 -left-20 w-[26rem] h-[26rem] rounded-full bg-white/10 blur-3xl pointer-events-none" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />

              {/* Brand */}
              <Link href="/" className="shrink-0">
                <img
                  src="/logo-nobg.png"
                  alt="Neetell Logo"
                  className="h-55 w-auto"
                />
              </Link>

              {/* Main content */}
              <div className="relative z-10 space-y-6">
                {/* Eyebrow pill */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 w-fit">
                  <slide.Icon className="w-3.5 h-3.5 text-white" />
                  <span className="text-white/90 text-xs font-semibold tracking-wide uppercase">{slide.eyebrow}</span>
                </div>

                <div>
                  <h2 className="text-3xl xl:text-[2.1rem] font-bold text-white leading-snug mb-3">
                    {slide.title}
                  </h2>
                  <p className="text-white/70 text-[0.95rem] leading-relaxed">{slide.desc}</p>
                </div>

                {/* Stat card */}
                <div className="inline-flex items-center gap-4 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
                  <Zap className="w-5 h-5 text-white/80 flex-shrink-0" />
                  <div>
                    <div className="text-3xl font-black text-white leading-none">{slide.stat.value}</div>
                    <div className="text-white/60 text-sm mt-0.5">{slide.stat.label}</div>
                  </div>
                </div>
              </div>

              <p className="relative z-10 text-white/35 text-xs pb-8">
                Trusted by students across all 28 states &amp; 8 UTs.
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </aside>
  );
}
