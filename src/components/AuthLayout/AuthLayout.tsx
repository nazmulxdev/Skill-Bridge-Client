"use client";

import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { GraduationCap, Sparkles, Shield, Clock, Users } from "lucide-react";
import { AnimatedGradient } from "./AnimatedGradient";
import BrandLogo from "../WebLogo/BrandLogo";

export function AuthLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Premium animated background */}
      <AnimatedGradient />

      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="relative z-10 flex min-h-screen">
        {/* Left Panel - Brand Showcase (hidden on mobile, visible md+) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex md:w-1/2 lg:w-[55%] xl:w-[60%] 2xl:w-[65%] relative bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-12 flex-col justify-between"
        >
          <div className="relative z-20">
            {/* Brand */}
            <BrandLogo />

            {/* Hero Content */}
            <div className="mt-16 max-w-xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight"
              >
                Bridge the gap between{" "}
                <span className="text-primary">knowledge</span> and{" "}
                <span className="text-primary">success</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-6 text-lg text-muted-foreground leading-relaxed"
              >
                Join thousands of learners and expert tutors on a journey of
                continuous growth. Book sessions, share knowledge, and build
                your future.
              </motion.p>

              {/* Feature List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-12 space-y-4"
              >
                {[
                  {
                    icon: Sparkles,
                    text: "Expert tutors from top companies",
                    color: "text-primary",
                  },
                  {
                    icon: Clock,
                    text: "Flexible scheduling, learn at your pace",
                    color: "text-success",
                  },
                  {
                    icon: Shield,
                    text: "Secure payments & verified reviews",
                    color: "text-warning",
                  },
                  {
                    icon: Users,
                    text: "Join 50,000+ active learners",
                    color: "text-chart-4",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div
                      className={`p-2 rounded-lg bg-${feature.color.split("-")[1]}/10 group-hover:bg-${feature.color.split("-")[1]}/20 transition-colors`}
                    >
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative z-20 max-w-md p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/20"
          >
            <div className="absolute -top-2 -right-2">
              <div className="relative">
                <div className="absolute inset-0 bg-success/30 blur-md rounded-full" />
                <Sparkles className="relative h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80 italic">
              "Skill Bridge transformed how I learn. The platform is intuitive,
              tutors are amazing, and I've grown my skills exponentially in just
              3 months."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">
                  NH
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold">Md. Nazmul Hossen</p>
                <p className="text-xs text-muted-foreground">
                  Full Stack Developer • 50+ sessions
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Panel - Auth Forms */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full md:w-1/2 lg:w-[45%] xl:w-[40%] 2xl:w-[35%] flex items-center justify-center p-6 sm:p-8 lg:p-12"
        >
          <div className="w-full max-w-md">
            {/* Mobile Brand - visible only on small screens */}
            <div className="md:hidden mb-8">
              <Link href="/" className="inline-flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  Skill Bridge
                </span>
              </Link>
            </div>

            {/* Auth Card with Glassmorphism */}
            <div className="relative">
              {/* Decorative gradient orb */}
              <div className="absolute -top-20 -right-20 h-64 w-64 bg-primary/20 rounded-full blur-3xl opacity-70 animate-pulse-slow" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-success/20 rounded-full blur-3xl opacity-70 animate-pulse-slower" />

              {/* Content */}
              <div className="relative bg-card/70 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10">
                <AnimatePresence mode="wait">{children}</AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
