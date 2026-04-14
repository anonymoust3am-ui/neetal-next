"use client";
import { motion } from "motion/react";
import { Smartphone, Download, Bell, Shield, Zap } from "lucide-react";
import AnimatedTitle from "./AnimatedTitle";

export function AppPreview() {
  return (
    <section className="py-24 bg-gradient-to-br from-bg-primary via-secondary/20 to-accent/20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-md border border-border mb-6">
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Mobile App</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight text-foreground">
              One App for All Your
              <span className="block text-primary">Counselling Needs</span>
            </h2>

            <p className="text-xl text-foreground-muted mb-8 leading-relaxed">
              Get instant access to all counselling data, tools, and expert
              guidance right in your pocket. Available on both iOS and Android.
            </p>

            <div className="space-y-4 mb-8">
              {[
                {
                  icon: Bell,
                  text: "Real-time notifications for important updates",
                },
                { icon: Shield, text: "Secure and encrypted data storage" },
                { icon: Zap, text: "Lightning-fast performance" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-card/50 backdrop-blur-md border border-border flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-lg text-foreground-muted">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="group px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center gap-3 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </button>

              <button className="group px-6 py-4 bg-card/50 backdrop-blur-md border border-border text-foreground rounded-xl font-semibold flex items-center gap-3 hover:bg-card transition-all duration-300">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-foreground-muted">Get it on</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-foreground">4.8★</div>
                <div className="text-sm text-foreground-muted mt-1">App Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">100K+</div>
                <div className="text-sm text-foreground-muted mt-1">Downloads</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-foreground-muted mt-1">Active Users</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:flex justify-center items-center"
          >
            <motion.img
              src="https://iili.io/qXVsMtn.png"
              alt="App Interface"
              className="w-[550px] h-[550px] object-cover"
              animate={{ rotate: [-6, 6, -6] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                WebkitMaskImage:
                  "linear-gradient(to top, transparent 0%, black 25%)",
                maskImage: "linear-gradient(to top, transparent 0%, black 25%)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}