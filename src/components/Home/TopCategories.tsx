// components/Home/TopCategories.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calculator,
  Beaker,
  Globe,
  Code,
  Music,
  Palette,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  {
    id: "math",
    name: "Mathematics",
    icon: Calculator,
    color: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-500/10",
    textLight: "text-blue-600 dark:text-blue-400",
    students: "12.5k+",
    tutors: 245,
    subjects: ["Algebra", "Calculus", "Geometry", "Statistics", "Trigonometry"],
  },
  {
    id: "science",
    name: "Science",
    icon: Beaker,
    color: "from-green-500 to-emerald-500",
    bgLight: "bg-green-500/10",
    textLight: "text-green-600 dark:text-green-400",
    students: "10.2k+",
    tutors: 189,
    subjects: [
      "Physics",
      "Chemistry",
      "Biology",
      "Environmental Sci",
      "Astronomy",
    ],
  },
  {
    id: "programming",
    name: "Programming",
    icon: Code,
    color: "from-purple-500 to-pink-500",
    bgLight: "bg-purple-500/10",
    textLight: "text-purple-600 dark:text-purple-400",
    students: "15.8k+",
    tutors: 312,
    subjects: ["JavaScript", "Python", "Java", "Web Dev", "Data Science"],
  },
  {
    id: "languages",
    name: "Languages",
    icon: Globe,
    color: "from-orange-500 to-red-500",
    bgLight: "bg-orange-500/10",
    textLight: "text-orange-600 dark:text-orange-400",
    students: "8.9k+",
    tutors: 167,
    subjects: ["English", "Spanish", "French", "German", "Mandarin"],
  },
  {
    id: "arts",
    name: "Arts & Design",
    icon: Palette,
    color: "from-pink-500 to-rose-500",
    bgLight: "bg-pink-500/10",
    textLight: "text-pink-600 dark:text-pink-400",
    students: "6.4k+",
    tutors: 98,
    subjects: ["Drawing", "Painting", "Digital Art", "Photography", "Design"],
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    color: "from-indigo-500 to-purple-500",
    bgLight: "bg-indigo-500/10",
    textLight: "text-indigo-600 dark:text-indigo-400",
    students: "7.2k+",
    tutors: 134,
    subjects: ["Piano", "Guitar", "Violin", "Music Theory", "Vocal"],
  },
];

const popularSubjects = [
  {
    name: "JavaScript",
    category: "Programming",
    students: 3421,
    tutors: 89,
    growth: "+24%",
  },
  {
    name: "Calculus",
    category: "Mathematics",
    students: 2856,
    tutors: 67,
    growth: "+18%",
  },
  {
    name: "Python",
    category: "Programming",
    students: 4123,
    tutors: 112,
    growth: "+32%",
  },
  {
    name: "Physics",
    category: "Science",
    students: 1987,
    tutors: 45,
    growth: "+12%",
  },
  {
    name: "English",
    category: "Languages",
    students: 2567,
    tutors: 78,
    growth: "+15%",
  },
  {
    name: "Guitar",
    category: "Music",
    students: 1432,
    tutors: 34,
    growth: "+21%",
  },
];

const stats = [
  { label: "Active Students", value: "45.2k+", icon: Users, change: "+15.3%" },
  { label: "Expert Tutors", value: "1,245+", icon: Star, change: "+8.7%" },
  { label: "Daily Sessions", value: "892+", icon: Clock, change: "+21.4%" },
  { label: "Subjects", value: "156+", icon: BookOpen, change: "+6.2%" },
];

export function TopCategories() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section className="w-full bg-gradient-to-b from-background to-muted/30 relative overflow-hidden mb-8">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Learning Path
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Browse through our extensive collection of subjects taught by expert
            tutors
          </p>
        </div>

        {/* Live Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600 text-xs"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setActiveCategory(category.id)}
                onHoverEnd={() => setActiveCategory(null)}
                className="relative group outline-none focus:outline-none"
              >
                <Card
                  className={cn(
                    "relative overflow-hidden border-2 transition-all duration-500 h-full bg-card",
                    isActive
                      ? "border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                      : "border-border hover:border-primary/30",
                  )}
                >
                  {/* Gradient Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                      category.color,
                    )}
                  />

                  <CardContent className="p-5 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center",
                            category.bgLight,
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 sm:h-6 sm:w-6",
                              category.textLight,
                            )}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg sm:text-xl text-foreground">
                            {category.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {category.tutors} Tutors
                          </p>
                        </div>
                      </div>

                      {/* Student Count Badge */}
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-0"
                      >
                        {category.students}
                      </Badge>
                    </div>

                    {/* Subjects List */}
                    <div className="space-y-2 mb-4">
                      {category.subjects.slice(0, 4).map((subject, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-0"
                        >
                          <span className="text-foreground/80">{subject}</span>
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 50) + 20}+ tutors
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Explore Link */}
                    <Link
                      href={`/tutors?category=${category.id}`}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group/link"
                    >
                      Explore {category.name}
                      <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Popular Subjects Section */}
        <div className="mt-16 md:mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Trending Subjects
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Most popular subjects among students this month
              </p>
            </div>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-primary/5 border-primary/20"
            >
              <TrendingUp className="h-3 w-3 mr-1 text-primary" />
              Updated daily
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularSubjects.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-border/50 hover:border-primary/30 transition-colors bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {subject.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {subject.category}
                        </p>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 border-0">
                        {subject.growth}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-muted/30 p-2 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">
                          Students
                        </p>
                        <p className="font-bold text-primary">
                          {subject.students.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-muted/30 p-2 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Tutors</p>
                        <p className="font-bold text-foreground">
                          {subject.tutors}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 md:mt-20">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardContent className="p-8 sm:p-10 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Ready to Start Learning?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6">
                Join thousands of students who are already learning with our
                expert tutors
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tutors">
                  <Button size="lg" className="gap-2 px-8">
                    Browse All Tutors
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
