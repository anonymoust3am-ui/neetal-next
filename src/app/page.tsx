"use client";
import Image from "next/image";
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
import { useEffect, useState } from "react";
import { Hero } from "@/components/landingV2/HeroMobile";

export default function Home() {

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
      <Hero />
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
      <Footer />
    </div>
  );
}
