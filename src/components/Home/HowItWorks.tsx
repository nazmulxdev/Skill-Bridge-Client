// components/Home/HowItWorks.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  UserCheck,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Find Your Tutor",
    description:
      "Browse through hundreds of expert tutors filtered by subject, price, and rating",
    icon: Search,
    gradient: "from-primary to-primary/60",
    stats: "500+ Tutors",
  },
  {
    id: 2,
    title: "Check Availability",
    description:
      "View tutor schedules and book sessions at your preferred time",
    icon: Calendar,
    gradient: "from-primary to-primary/60",
    stats: "24/7 Booking",
  },
  {
    id: 3,
    title: "Start Learning",
    description:
      "Connect with your tutor and begin your personalized learning journey",
    icon: UserCheck,
    gradient: "from-primary to-primary/60",
    stats: "1-on-1 Sessions",
  },
  {
    id: 4,
    title: "Track Progress",
    description:
      "Get feedback, track improvements, and achieve your learning goals",
    icon: MessageSquare,
    gradient: "from-primary to-primary/60",
    stats: "Progress Tracking",
  },
];

const benefits = [
  "Verified tutors with background checks",
  "Secure payment protection",
  "Free cancellation up to 24 hours",
  "Satisfaction guarantee",
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="w-full py-12 bg-gradient-to-b from-background via-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-xs border-border bg-muted/50 inline-flex items-center"
          >
            <Sparkles className="h-3 w-3 mr-1 text-primary" />
            Simple Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Start Learning in{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Four Easy Steps
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who have already found their perfect
            tutor
          </p>
        </div>

        {/* Steps Grid - REMOVED whileInView to prevent RSC fetches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }} // Changed from whileInView to animate
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setActiveStep(step.id)}
                className="relative group h-full outline-none focus:outline-none"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-[calc(100%+1rem)] h-0.5 bg-gradient-to-r from-border to-transparent">
                    <ArrowRight className="absolute -right-3 -top-2 h-4 w-4 text-muted-foreground/30" />
                  </div>
                )}

                <Card
                  className={cn(
                    "relative overflow-hidden border-2 transition-all duration-500 h-full bg-card outline-none focus:outline-none",
                    isActive
                      ? "border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                      : "border-border hover:border-primary/30",
                  )}
                >
                  {/* Gradient Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    )}
                  />

                  <CardContent className="p-6 sm:p-8 text-center relative outline-none focus:outline-none ">
                    {/* Step Number */}
                    <div className="absolute top-3 left-3 text-3xl sm:text-4xl font-black text-muted-foreground">
                      {String(step.id).padStart(2, "0")}
                    </div>

                    {/* Icon Container */}
                    <div className="relative mb-5 sm:mb-6 inline-block">
                      <div
                        className={cn(
                          "absolute inset-0 rounded-full blur-xl transition-all duration-500 bg-primary/10",
                          isActive && "scale-150 opacity-70",
                        )}
                      />
                      <div
                        className={cn(
                          "relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
                        )}
                      >
                        <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">
                      {step.description}
                    </p>

                    {/* Stats Badge */}
                    <Badge
                      variant="secondary"
                      className="mt-2 px-3 py-1 text-xs sm:text-sm font-medium bg-primary/10 text-primary border-0"
                    >
                      {step.stats}
                    </Badge>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeStep"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Strip - REMOVED whileInView */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-6 sm:p-8 rounded-2xl bg-card border border-border/50 shadow-lg">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-sm sm:text-base outline-none focus:outline-none"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <span className="text-foreground/80">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
