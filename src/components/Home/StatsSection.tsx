"use client";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  Star,
  Clock,
  Trophy,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "45,200+",
    label: "Active Students",
    color: "text-blue-500",
  },
  {
    icon: GraduationCap,
    value: "1,245+",
    label: "Expert Tutors",
    color: "text-green-500",
  },
  {
    icon: BookOpen,
    value: "156+",
    label: "Subjects",
    color: "text-purple-500",
  },
  {
    icon: Clock,
    value: "892+",
    label: "Daily Sessions",
    color: "text-orange-500",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average Rating",
    color: "text-yellow-500",
  },
  { icon: Trophy, value: "98%", label: "Success Rate", color: "text-rose-500" },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-background border flex items-center justify-center mb-3">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
