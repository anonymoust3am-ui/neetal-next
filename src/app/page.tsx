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
import { FeatureGrid } from "@/components/FeaturesGride";
import { Hero } from "@/components/Hero";
import { ScrollProgressBar } from "@/components/dashboard/ScrollProgressBar";
import ExamScroller from "@/components/ExamScroller";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background font-sans">
      <ScrollProgressBar />
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <Navbar />
      <Hero />
      <HeroSection />
      <PainSection />
      <HowItWorks />
      <DataIntelligence />
      <FeatureGrid />
      <Testimonials />
      <PricingPlans />
      <AppPreview />
      <Footer />
    </div>
  );
}
