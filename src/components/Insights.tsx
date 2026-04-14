"use client";
import { motion } from "motion/react";
import { TrendingUp, Calendar, AlertCircle, Users } from "lucide-react";
import AnimatedTitle from "./AnimatedTitle";

interface UpdateItem {
  label?: string;
  date?: string;
  status?: "upcoming" | "scheduled" | "ongoing" | "completed";
  trend?: "up" | "down" | "stable";
  rank?: string;
  time?: string;
  tip?: string;
}

interface Insight {
  icon: React.ElementType;
  title: string;
  updates: UpdateItem[];
  iconColor: string;
}

const insights: Insight[] = [
  {
    icon: Calendar,
    title: "Important Dates",
    updates: [
      {
        label: "Round 1 Registration",
        date: "March 15 - March 25, 2026",
        status: "upcoming",
      },
      {
        label: "Round 1 Allotment",
        date: "March 28, 2026",
        status: "upcoming",
      },
      {
        label: "Round 2 Choice Filling",
        date: "April 5 - April 12, 2026",
        status: "scheduled",
      },
      {
        label: "Round 2 Allotment",
        date: "April 15, 2026",
        status: "scheduled",
      },
      {
        label: "Mop-Up Round Registration",
        date: "April 25 - April 30, 2026",
        status: "scheduled",
      },
    ],
    iconColor: "bg-primary",
  },
  {
    icon: TrendingUp,
    title: "Cut-Off Trends",
    updates: [
      { label: "AIIMS Delhi (Gen)", rank: "AIR 50-80", trend: "stable" },
      { label: "JIPMER Puducherry (Gen)", rank: "AIR 250-350", trend: "up" },
      { label: "GMC Mumbai (Gen)", rank: "AIR 800-1000", trend: "down" },
      { label: "KGMU Lucknow (Gen)", rank: "AIR 1200-1500", trend: "stable" },
      { label: "SMS Jaipur (Gen)", rank: "AIR 1800-2200", trend: "down" },
      { label: "CMC Vellore (Gen)", rank: "AIR 100-200", trend: "up" },
    ],
    iconColor: "bg-secondary",
  },
  {
    icon: AlertCircle,
    title: "Latest Announcements",
    updates: [
      {
        label: "New counselling guidelines released for 2026",
        time: "2 hours ago",
      },
      { label: "Seat matrix updated with 500 new seats", time: "5 hours ago" },
      {
        label: "Fee structure revised for private colleges",
        time: "1 day ago",
      },
      {
        label: "Document verification schedule announced",
        time: "2 days ago",
      },
      {
        label: "Provisional merit list to be released tomorrow",
        time: "3 days ago",
      },
    ],
    iconColor: "bg-warning",
  },
  {
    icon: Users,
    title: "Expert Tips",
    updates: [
      { tip: "Always fill maximum choices to increase chances" },
      { tip: "Check bond & service requirements before selecting" },
      { tip: "Verify documents well before counselling dates" },
      { tip: "Keep multiple payment options ready for fees" },
      { tip: "Research college location and facilities before locking" },
      { tip: "Don't wait for last minute - lock choices early" },
    ],
    iconColor: "bg-success",
  },
];

export function CounsellingInsights() {
  return (
    <section className="py-24 bg-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <AnimatedTitle
            text="Stay Updated, Stay Ahead"
            className="text-4xl md:text-5xl font-bold text-foreground mb-3"
          />

          <p className="text-xl text-foreground-muted">
            Real-time updates, trends, and expert guidance to navigate your
            counselling journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-8 rounded-xl bg-card border border-border hover:border-transparent hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-14 h-14 rounded-xl ${insight.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}
                  >
                    <insight.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {insight.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {insight.updates.map((update, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-bg-secondary border border-border hover:border-border-strong transition-colors"
                    >
                      {update.label && (
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-foreground flex-1">
                            {update.label}
                          </span>
                          {update.status && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                update.status === "upcoming"
                                  ? "bg-success-light text-success"
                                  : update.status === "scheduled"
                                  ? "bg-info-light text-info"
                                  : update.status === "ongoing"
                                  ? "bg-warning-light text-warning"
                                  : "bg-muted text-foreground-muted"
                              }`}
                            >
                              {update.status}
                            </span>
                          )}
                          {update.trend && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                update.trend === "up"
                                  ? "bg-error-light text-error"
                                  : update.trend === "down"
                                  ? "bg-success-light text-success"
                                  : "bg-muted text-foreground-muted"
                              }`}
                            >
                              {update.trend === "up"
                                ? "↑ Up"
                                : update.trend === "down"
                                ? "↓ Down"
                                : "→ Stable"}
                            </span>
                          )}
                        </div>
                      )}
                      {update.date && (
                        <div className="text-sm text-foreground-muted mt-1">
                          📅 {update.date}
                        </div>
                      )}
                      {update.rank && (
                        <div className="text-sm text-foreground-muted mt-1">
                          🎯 Expected Rank: {update.rank}
                        </div>
                      )}
                      {update.time && (
                        <div className="text-sm text-foreground-muted mt-1 flex items-center gap-1">
                          <span>🕒</span> {update.time}
                        </div>
                      )}
                      {update.tip && (
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0"></div>
                          <span className="text-foreground-muted">
                            💡 {update.tip}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button className="mt-6 text-sm font-semibold text-primary hover:text-primary-hover transition-opacity">
                  View all updates →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="relative p-10 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground overflow-hidden shadow-xl">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center">
              <h3 className="text-3xl font-bold mb-3 text-white">
                Get Counselling Updates
              </h3>

              <p className="text-white/80 mb-8 text-lg">
                Stay updated with NEET counselling alerts, deadlines, and
                college updates.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto bg-white/20 backdrop-blur-md p-2 rounded-full">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-5 py-3 rounded-full bg-white text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button className="px-8 py-3 bg-white text-primary font-semibold rounded-full hover:bg-gray-100 transition-all">
                  Subscribe
                </button>
              </div>

              <div className="mt-6">
                <a
                  href="https://chat.whatsapp.com/YOUR_GROUP_LINK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-success hover:bg-success/90 text-white font-semibold rounded-full transition-all shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.52 3.48A11.8 11.8 0 0012.05 0C5.4 0 .05 5.36.05 12c0 2.11.55 4.17 1.6 5.98L0 24l6.18-1.62A11.9 11.9 0 0012.05 24c6.65 0 12-5.36 12-12 0-3.2-1.25-6.21-3.53-8.52zM12.05 21.7c-1.8 0-3.57-.49-5.1-1.41l-.36-.22-3.67.96.98-3.58-.23-.37a9.63 9.63 0 01-1.49-5.08c0-5.33 4.35-9.68 9.7-9.68 2.59 0 5.02 1.01 6.85 2.83a9.63 9.63 0 012.85 6.85c0 5.33-4.35 9.7-9.7 9.7zm5.37-7.24c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.73.94-.9 1.13-.17.19-.34.21-.63.07-.29-.14-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.12-.6.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.44s1.03 2.83 1.18 3.02c.14.19 2.03 3.1 4.92 4.34.69.3 1.23.48 1.65.62.69.22 1.32.19 1.82.12.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.36-.07-.1-.26-.17-.55-.31z" />
                  </svg>
                  Join WhatsApp Group
                </a>
              </div>

              <p className="text-xs text-white/70 mt-4">
                No spam. Only important counselling updates.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}