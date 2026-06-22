"use client";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navbar } from "@/components/Navbar";
import { Testimonials } from "@/components/Testimonials";
import { PricingPlans } from "@/components/PricingPlans";
import App from "next/app";
import { AppPreview } from "@/components/AppPreview";
import { Footer } from "@/components/Footer";
import { InsightsSection } from "@/components/dashboard/sections/InsightsSection";
import { HeroSection } from "@/components/subHero";
import { PainSection } from "@/components/PainSection";
import { HowItWorks } from "@/components/HowItWorks";
import { DataIntelligence } from "@/components/DataInteligence";
import { ScrollProgressBar } from "@/components/dashboard/ScrollProgressBar";
import ExamScroller from "@/components/ExamScroller";
import { FeatureGrid } from "@/components/landingV2/featuresScroll";
import { useEffect, useRef, useState } from "react";
import { Hero } from "@/components/landingV2/HeroMobile";
import { FAQSection } from "@/components/FAQSection";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, ArrowUp, LayoutDashboard, Sparkles } from "lucide-react";

function LandingFloatingActions({ heroRef }: { heroRef: React.RefObject<HTMLDivElement | null> }) {
  const { user, loading } = useAuth();
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const hero = heroRef.current;
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      setShow(y > heroEnd - 24);
      setProgress(maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [heroRef]);

  const href = user ? "/dashboard" : "/auth";
  const label = user ? "Dashboard" : "Get Started";
  const FloatingIcon = user ? LayoutDashboard : Sparkles;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <>
      <Link
        href={href}
        aria-hidden={!show}
        className={`fixed bottom-5 left-1/2 z-40 flex h-12 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-primary px-5 text-sm text-primary-foreground shadow-[0_12px_35px_rgba(15,23,42,0.22)] transition-all duration-300 md:hidden ${show
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 pointer-events-none"
          }`}
      >
        {!loading && <FloatingIcon size={16} className="shrink-0" />}
        <span className="shrink-0">{loading ? "Loading..." : label}</span>
        <ArrowRight size={16} className="shrink-0" />
      </Link>

      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-7 right-7 z-40 hidden h-14 w-14 items-center justify-center rounded-full border border-border bg-surface/95 text-primary shadow-[0_12px_35px_rgba(15,23,42,0.18)] backdrop-blur transition-all duration-300 md:flex ${show
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 pointer-events-none"
          }`}
      >
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="3" />
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <ArrowUp size={19} className="relative z-10" />
      </button>
    </>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < breakpoint);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, [breakpoint]);

    return isMobile;
  }

   const isMobile = useIsMobile();

  return (
    <div className="flex flex-col flex-1 bg-background font-sans">
      <ScrollProgressBar />
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <Navbar />
      <div ref={heroRef}>
        <Hero />
      </div>
      {/* {isMobile ? <MobileHero /> : <Hero />}; */}
      <HeroSection />
      <PainSection />
      <HowItWorks />
      <DataIntelligence />
      {/* <FeatureGrid /> */}
      <FeatureGrid />
      <Testimonials />
      <section id="pricing">
        <PricingPlans />
      </section>
      <AppPreview />
      {/* <FAQSection /> */}
      <Footer />
      <LandingFloatingActions heroRef={heroRef} />
    </div>
  );
}
