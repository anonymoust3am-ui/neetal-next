"use client";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext"

export function Hero() {
  const { theme } = useTheme();
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `url('/hero-${theme}.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay (light + dark optimized) */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

      {/* Gradient fade for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/40 to-transparent dark:from-black/70 dark:via-black/45 dark:to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-xl"> {/* 🔥 reduced width */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
              bg-card/60 backdrop-blur-md border border-border mb-5"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm text-foreground">
                India's #1 Medical Counselling Platform
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight text-foreground"
            >
              Your Dream Medical College
              <span className="block text-primary">Starts Here</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-foreground-muted mb-7 leading-relaxed"
            >
              Navigate NEET counselling with confidence. Get personalized
              guidance, real-time data, and expert insights to secure your seat
              in top medical colleges.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <button className="group px-6 py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="group px-6 py-3 bg-card/70 hover:bg-card border border-border text-foreground rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 transition-all duration-300 backdrop-blur-md">
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-5 mt-10 pt-6 border-t border-border"
            >
              <div>
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-xs text-foreground-muted mt-1">
                  Students Counselled
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-xs text-foreground-muted mt-1">
                  Success Rate
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-xs text-foreground-muted mt-1">
                  Expert Support
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
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