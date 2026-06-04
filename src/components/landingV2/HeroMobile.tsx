"use client";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Play, Building2, MapPin, ChevronDown, GraduationCap, School } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { SocialProof } from "../landingV2/SocialProof";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Hero() {
  return (
    <>
      {/* --- DESKTOP LAYOUT --- */}
      {/* Visible on medium screens (768px) and up */}
      <div className="hidden md:block">
        <HeroDesktop />
      </div>

      {/* --- MOBILE LAYOUT --- */}
      {/* Visible on small screens, hidden on medium screens and up */}
      <div className="block md:hidden">
        <HeroMobile />
      </div>
    </>
  );
}

export function HeroDesktop() {
  const [activeCourse, setActiveCourse] = useState("MBBS");
  const [rank, setRank] = useState(30895);

  // Interactive Select States for Right Side Container Dropdowns
  const [quota, setQuota] = useState("All");
  const [category, setCategory] = useState("All");
  const [isPredicted, setIsPredicted] = useState(false);

  // Simple mock arrays for dropdown selection toggles
  const quotaOptions = ["All", "All India Quota (AIQ)", "State Quota", "Management Quota"];
  const categoryOptions = ["All", "General", "OBC", "SC", "ST", "EWS"];

  // Toggle state arrays
  const [showQuotaDropdown, setShowQuotaDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  return (
    <section className="relative w-full h-screen min-h-[650px] flex items-center bg-white dark:bg-zinc-950 p-0 m-0 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 h-full w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16 items-center h-full w-full">

          {/* LEFT SIDE: Double Flex Flow Structure */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full py-12 relative">

            {/* Top Anchor Spacer (Keeps the alignment stable) */}
            <div className="hidden lg:block opacity-0 select-none pointer-events-none">Spacer</div>

            {/* VERTICAL CENTER BLOCK: Text & Primary Actions */}
            <div className="pt-4 flex flex-col justify-center my-auto space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 w-fit"
              >
                <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                <span className="text-xs font-bold tracking-wider uppercase text-orange-600 dark:text-orange-500">
                  NEET 2026 Counseling Intelligence
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="pt-15 text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] text-zinc-900 dark:text-zinc-50"
              >
                Your Dream Medical College <br />
                <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Starts Right Here
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl font-medium"
              >
                Stop guessing closing ranks. Cut through complex state quota laws, seat matrices, and fees with India's most precise AI-driven matching ecosystem.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-row items-center gap-4 pt-6"
              >
                <button
                  onClick={() => setIsPredicted(true)}
                  className="group px-7 py-4 bg-orange-600 hover:bg-orange-600/95 text-white font-bold rounded-xl text-base flex items-center gap-2 shadow-lg shadow-orange-600/15 transition-all hover:-translate-y-0.5"
                >
                  Predict My College
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </button>

                <button className="group px-6 py-4 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold rounded-xl text-base flex items-center gap-2 transition-all">
                  <Play className="w-4 h-4 fill-current stroke-none" />
                  See How It Works
                </button>
              </motion.div>
            </div>

            {/* BOTTOM ANCHOR BLOCK: Social Proof explicitly pinned to bottom left */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="border-t border-zinc-200 dark:border-zinc-800/60 mt-auto w-fit"
            >
              <SocialProof />
            </motion.div>
          </div>

          {/* RIGHT SIDE: Dynamic Predictor Framework (5 Columns) */}
          <div className="lg:col-span-5 w-full flex flex-col items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="w-full max-w-[410px] p-5 bg-white dark:bg-zinc-900 rounded-[1.75rem] border border-zinc-150 dark:border-zinc-800 shadow-xl flex flex-col text-left text-zinc-900 dark:text-zinc-50 font-sans z-20"
            >
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Your Preferred Counselling</label>
                <div className="relative flex items-center justify-between w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold cursor-not-allowed text-zinc-400 dark:text-zinc-600">
                  <span className="truncate pr-4">All India UG - Medical & Dental</span>
                  <ChevronDown size={14} className="flex-shrink-0" />
                </div>
              </div>

              {/* Course Selector Rows */}
              <div className="space-y-1.5 mt-3.5">
                <label className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Course</label>
                <div className="grid grid-cols-2 gap-2">
                  {["MBBS", "BDS"].map((course) => (
                    <button
                      key={course}
                      type="button"
                      onClick={() => {
                        setActiveCourse(course);
                        setIsPredicted(false); // Reset prediction preview layout to update numbers dynamically
                      }}
                      className={cn(
                        "py-2 rounded-xl text-xs font-bold border transition-all duration-150",
                        activeCourse === course
                          ? "bg-orange-50 dark:bg-orange-950/20 border-orange-500 dark:border-orange-500 text-orange-600 dark:text-orange-400 font-extrabold"
                          : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                      )}
                    >
                      {course}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quota & Category Select Dropdowns */}
              <div className="grid grid-cols-2 gap-3 mt-3.5 relative">
                {/* Quota Element */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Quota</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuotaDropdown(!showQuotaDropdown);
                      setShowCategoryDropdown(false);
                    }}
                    className="relative flex items-center justify-between w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold cursor-pointer text-zinc-700 dark:text-zinc-300 text-left"
                  >
                    <span className="truncate pr-2">{quota}</span>
                    <ChevronDown size={14} className="text-zinc-400 flex-shrink-0" />
                  </button>

                  {showQuotaDropdown && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg max-h-40 overflow-y-auto z-50 p-1">
                      {quotaOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => {
                            setQuota(opt);
                            setShowQuotaDropdown(false);
                            setIsPredicted(false);
                          }}
                          className="px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 truncate"
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Element */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Category</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryDropdown(!showCategoryDropdown);
                      setShowQuotaDropdown(false);
                    }}
                    className="relative flex items-center justify-between w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold cursor-pointer text-zinc-700 dark:text-zinc-300 text-left"
                  >
                    <span className="truncate pr-2">{category}</span>
                    <ChevronDown size={14} className="text-zinc-400 flex-shrink-0" />
                  </button>

                  {showCategoryDropdown && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg max-h-40 overflow-y-auto z-50 p-1">
                      {categoryOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => {
                            setCategory(opt);
                            setShowCategoryDropdown(false);
                            setIsPredicted(false);
                          }}
                          className="px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Rank Container Tracker */}
              <div className="flex items-center justify-between mt-5 mb-1.5">
                <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Your Rank</h3>
                <div className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl font-bold text-base text-zinc-900 dark:text-zinc-50 min-w-[90px] text-center shadow-inner">
                  {rank.toLocaleString()}
                </div>
              </div>

              {/* Slider Track Element */}
              <div className="relative w-full mb-5 flex items-center">
                <input
                  type="range"
                  min="1"
                  max="100000"
                  value={rank}
                  onChange={(e) => {
                    setRank(Number(e.target.value));
                    setIsPredicted(false);
                  }}
                  className="w-full h-1.5 bg-orange-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-600 range-sm"
                  style={{
                    background: `linear-gradient(to right, #ea580c 0%, #ea580c ${(rank / 100000) * 100}%, ${typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? "#27272a" : "#ffedd5"} ${(rank / 100000) * 100}%, ${typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? "#27272a" : "#ffedd5"} 100%)`
                  }}
                />
              </div>

              {/* DYNAMIC FOOTER SECTION (Animate Switch Framework) */}
              <div className="min-h-[110px] relative w-full flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {!isPredicted ? (
                    /* STATE A: Initial Placeholder Text */
                    <motion.div
                      key="initial-placeholder"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Enter your NEET score to see predicted college choices
                      </p>
                    </motion.div>
                  ) : (
                    /* STATE B: Found College Output Matrix Cards */
                    <motion.div
                      key="colleges-output"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="w-full space-y-2"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1 flex items-center justify-between">
                        <span>Found Matching Colleges</span>
                        <span className="text-orange-500 font-black">2 Matches</span>
                      </div>

                      {/* College Card Row 1 */}
                      <div className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-3 shadow-inner">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-9 h-9 rounded-lg bg-orange-500/10 dark:bg-orange-500/5 border border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                            <School size={18} />
                          </div>
                          <div className="truncate space-y-0.5">
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate tracking-tight">MAMC, New Delhi</h4>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 truncate font-medium">
                              <MapPin size={10} /> New Delhi, AIQ Quota
                            </p>
                          </div>
                        </div>
                        <button type="button" className="text-[10px] font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1.5 rounded-lg shadow-sm flex-shrink-0 pointer-events-none opacity-80">
                          Details
                        </button>
                      </div>

                      {/* College Card Row 2 */}
                      <div className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-3 shadow-inner">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                            <School size={18} />
                          </div>
                          <div className="truncate space-y-0.5">
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate tracking-tight">VMMC & Safdarjung</h4>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 truncate font-medium">
                              <MapPin size={10} /> New Delhi, State Quota
                            </p>
                          </div>
                        </div>
                        <button type="button" className="text-[10px] font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1.5 rounded-lg shadow-sm flex-shrink-0 pointer-events-none opacity-80">
                          Details
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Button: Swapped Explore to Predict */}
              <button
                type="button"
                onClick={() => setIsPredicted(true)}
                className="w-full mt-3.5 py-3 bg-orange-600 hover:bg-orange-600/95 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg shadow-orange-600/15"
              >
                Predict Now
                <ArrowRight size={16} className="stroke-[2.5]" />
              </button>

              <p className="text-[9px] text-center text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed mt-3">
                *Estimated based on past cut-offs. Actual choices may vary by personal preference.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

function HeroMobile() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 px-4 bg-[var(--color-bg-primary)]">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-500 border border-orange-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase">
            NEET 2026 Intelligence
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Your Dream Medical College{" "}
          <span className="block text-4xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            Starts Right Here
          </span>
        </h1>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm">
          Cut through confusing state quota laws, complex seat matrices, and fee structures with India's most precise AI engine.
        </p>
      </div>

      <div className="my-6 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
        <SocialProof />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          Predict My College
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button className="w-full py-4 bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold rounded-xl text-sm flex items-center justify-center gap-2">
          <Play className="w-3.5 h-3.5 fill-current stroke-none" />
          See How It Works
        </button>
      </div>
    </section>
  );
}