"use client"
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Play, Shield, Zap, Users } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-text-primary) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-md border border-border mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">India's #1 Medical Counselling Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-foreground"
            >
              Your Dream Medical College
              <span className="block text-primary">Starts Here</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-foreground-muted mb-8 leading-relaxed"
            >
              Navigate NEET counselling with confidence. Get personalized guidance, real-time data, and expert insights to secure your seat in top medical colleges.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <button className="group px-8 py-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group px-8 py-4 bg-card hover:bg-card-hover border border-border text-foreground rounded-full font-semibold text-lg flex items-center gap-2 transition-all duration-300">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border"
            >
              <div>
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-foreground-muted mt-1">Students Counselled</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-foreground-muted mt-1">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-foreground-muted mt-1">Expert Support</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glassmorphism Card */}
              <div className="relative p-8 rounded-xl bg-card/30 backdrop-blur-md border border-border shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1651804810223-6997a7d3fe7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc3R1ZGVudCUyMHN0dWR5aW5nfGVufDF8fHx8MTc3Mjk5NTIxMXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Medical Student"
                  className="rounded-lg w-full h-auto object-cover"
                />
                
                {/* Floating Stats Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -left-6 px-6 py-4 rounded-lg bg-primary shadow-lg"
                >
                  <div className="text-primary-foreground text-sm font-medium">✓ College Matched</div>
                  <div className="text-primary-foreground text-2xl font-bold mt-1">AIIMS Delhi</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-6 -right-6 px-6 py-4 rounded-lg bg-secondary shadow-lg"
                >
                  <div className="text-secondary-foreground text-sm font-medium">Your Rank</div>
                  <div className="text-secondary-foreground text-2xl font-bold mt-1">AIR 1,234</div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 rounded-xl blur-3xl"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground-muted text-center"
      >
        <div className="text-sm mb-2">Scroll to explore</div>
        <div className="w-6 h-10 border-2 border-border rounded-full mx-auto flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-foreground-muted rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}