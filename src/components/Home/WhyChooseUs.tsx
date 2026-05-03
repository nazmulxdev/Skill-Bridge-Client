"use client";
import { motion } from "framer-motion";
import {
  Shield,
  CreditCard,
  Headphones,
  Gift,
  Zap,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Tutors",
    desc: "All tutors pass background checks and skill verification.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    desc: "Your transactions are encrypted and protected.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "We're here to help whenever you need assistance.",
  },
  {
    icon: Gift,
    title: "Free Trial",
    desc: "First 30-minute session with any tutor is completely free.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    desc: "Book a session in under 60 seconds.",
  },
  {
    icon: CheckCircle,
    title: "Satisfaction Guaranteed",
    desc: "Not happy? Full refund within 24 hours.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Why SkillBridge?</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            We go beyond just connecting students and tutors – we ensure a
            seamless learning experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
