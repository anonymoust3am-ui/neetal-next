"use client";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { SocialProof } from "./landingV2/SocialProof";

export function Hero() {
  return (
    <>
      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden md:block">
        <HeroDesktop />
      </div>

      {/* --- REIMAGINED MOBILE LAYOUT --- */}
      <div className="block md:hidden">
        <HeroMobile />
      </div>
    </>
  );
}

// ==========================================
// 1. DESKTOP VERSION (Your untouched original)
// ==========================================
function HeroDesktop() {
  const { theme } = useTheme();
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-18"
      style={{
        backgroundImage: `url('/hero-${theme}.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/40 to-transparent dark:from-black/70 dark:via-black/45 dark:to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center mt-6 gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--color-primary-light)]/40 dark:bg-[var(--color-primary-light)]/10 border border-[var(--color-primary)]/20 w-fit mb-6"
          >
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-xs font-bold tracking-wider uppercase text-[var(--color-primary)]">
              NEET 2026 Counseling Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1] text-[var(--color-text-primary)] pt-8"
          >
            Your Dream Medical College <br className="hidden sm:inline" />
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-[var(--color-primary)] via-[#6366f1] to-[var(--color-primary)] bg-clip-text text-transparent">
              Starts Right Here
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-l text-[var(--color-text-secondary)] mb-8 leading-relaxed max-w-xl font-medium"
          >
            Stop guessing closing ranks. Cut through complex state quota laws, seat matrices, and fees with India's most precise AI-driven matching ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto mt-4"
          >
            <button className="group w-full sm:w-auto px-7 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-primary)]/15 transition-all hover:-translate-y-0.5">
              Predict My College
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </button>

            <button className="group w-full sm:w-auto px-6 py-4 bg-transparent border border-[var(--color-primary)]/70 text-[var(--color-primary)] font-bold rounded-xl text-base flex items-center justify-center gap-2 transition-all hover:bg-[var(--color-primary)]/5">
              <Play className="w-4 h-4 fill-current stroke-none" />
              See How It Works
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 border-t border-[var(--color-border)]/60 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <SocialProof />
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground-muted text-center"
      >
        <div className="text-xs mb-2">Scroll to explore</div>
        <div className="w-5 h-9 border-2 border-border rounded-full mx-auto flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 bg-foreground-muted rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}

// ==========================================
// 2. COMPLETELY REIMAGINED MOBILE LAYOUT
// ==========================================

function HeroMobile() {
  return (
    <section className="relative h-[100dvh] min-h-screen flex flex-col justify-around pt-16 pb-6 px-6 bg-[var(--color-bg-primary)] overflow-hidden">

      {/* Dynamic abstract grid pattern overlay just for mobile to make it look premium */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

      {/* Top Section: Badges and Headers */}
      <div className="flex flex-col items-center text-center space-y-4 z-10">

        {/* Animated Mobile Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary-light)]/30 text-[var(--color-primary)] border border-[var(--color-primary)]/15 backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 fill-[var(--color-primary)]/20 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider uppercase">
            NEET 2026 Intelligence
          </span>
        </motion.div>

        {/* Animated Mobile Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-[2.5rem] font-black tracking-tight text-[var(--color-text-primary)] leading-[1.15]"
        >
          Your Dream Medical College{" "}
          <span className="block text-8 mt-1 bg-gradient-to-r from-[var(--color-primary)] via-[#6366f1] to-[var(--color-primary)] bg-clip-text text-transparent">
            Starts Right Here
          </span>
        </motion.h1>

        {/* Animated Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-sm leading-relaxed text-[var(--color-text-secondary)] max-w-[310px] font-medium"
        >
          Cut through confusing state quota laws, complex seat matrices, and fee structures with India's most precise AI engine.
        </motion.p>
      </div>

      {/* Bottom Interface Block: Action CTAs + Student Photos */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-5 z-10">

        {/* Action Button stack container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col gap-2 sm:gap-2.5 w-full"
        >

          {/* Main CTA */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="group relative w-full py-3 sm:py-4 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-[var(--color-primary)]/20"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

            <span>Predict My College</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>

          {/* Secondary button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 sm:py-3.5 bg-transparent border border-[var(--color-primary)]/70 text-[var(--color-primary)] font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors hover:bg-[var(--color-primary)]/5"
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current stroke-none" />
            See How It Works
          </motion.button>

        </motion.div>

        {/* Beautiful Minimalist Student Stack Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col items-center justify-center gap-2 text-center"
        >
          <div className="flex -space-x-2 overflow-hidden">
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-[var(--color-bg-primary)] object-cover shadow-sm"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
              alt="AI IMS Aspirant"
            />
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-[var(--color-bg-primary)] object-cover shadow-sm"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
              alt="AI IMS Aspirant"
            />
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-[var(--color-bg-primary)] object-cover shadow-sm"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
              alt="AI IMS Aspirant"
            />
            <div className="inline-flex items-center justify-center h-7 w-7 rounded-full ring-2 ring-[var(--color-bg-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[9px] font-black shadow-sm">
              +10k
            </div>
          </div>
          <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] tracking-wide">
            Trusted by <span className="font-extrabold text-[var(--color-primary)]">10,000+</span> NEET 2026 aspirants across India
          </p>
        </motion.div>

      </div>

    </section>
  );
}