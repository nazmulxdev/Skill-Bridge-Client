// components/Home/TopCategories.tsx
"use client";

import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  {
    id: "math",
    name: "Mathematics",
    icon: Calculator,
    gradient: "from-primary to-primary/60",
    bgLight: "bg-primary/10",
    textLight: "text-primary",
    students: "12.5k+",
    tutors: 245,
    subjects: ["Algebra", "Calculus", "Geometry", "Statistics", "Trigonometry"],
  },
  {
    id: "science",
    name: "Science",
    icon: Beaker,
    gradient: "from-primary to-primary/60",
    bgLight: "bg-primary/10",
    textLight: "text-primary",
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
    gradient: "from-primary to-primary/60",
    bgLight: "bg-primary/10",
    textLight: "text-primary",
    students: "15.8k+",
    tutors: 312,
    subjects: ["JavaScript", "Python", "Java", "Web Dev", "Data Science"],
  },
  {
    id: "languages",
    name: "Languages",
    icon: Globe,
    gradient: "from-primary to-primary/60",
    bgLight: "bg-primary/10",
    textLight: "text-primary",
    students: "8.9k+",
    tutors: 167,
    subjects: ["English", "Spanish", "French", "German", "Mandarin"],
  },
  {
    id: "arts",
    name: "Arts & Design",
    icon: Palette,
    gradient: "from-primary to-primary/60",
    bgLight: "bg-primary/10",
    textLight: "text-primary",
    students: "6.4k+",
    tutors: 98,
    subjects: ["Drawing", "Painting", "Digital Art", "Photography", "Design"],
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    gradient: "from-primary to-primary/60",
    bgLight: "bg-primary/10",
    textLight: "text-primary",
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
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [tutorCounts, setTutorCounts] = useState<Record<string, number[]>>({});

  useEffect(() => {
    setMounted(true);

    // Generate random tutor counts for each category's subjects
    const counts: Record<string, number[]> = {};
    categories.forEach((category) => {
      counts[category.id] = category.subjects.map(
        () => Math.floor(Math.random() * 50) + 20,
      );
    });
    setTutorCounts(counts);
  }, []);

  if (!mounted) {
    return (
      <section className="w-full bg-gradient-to-b from-background to-muted/30 relative overflow-hidden mb-8">
        <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header Skeleton */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="p-4 sm:p-5">
                  <Skeleton className="h-8 w-8 rounded-full mb-2" />
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-border bg-card">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex justify-between py-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-background to-muted/30 relative overflow-hidden pt-6 pb-12">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-xs border-border bg-muted/50 inline-flex items-center"
          >
            <Sparkles className="h-3 w-3 mr-1 text-primary" />
            Explore Categories
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Learning Path
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our extensive collection of subjects taught by expert
            tutors
          </p>
        </div>

        {/* Live Stats Strip - REMOVED whileInView */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }} // Changed from whileInView to animate
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="border-border bg-card backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 text-xs"
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

        {/* Categories Grid - REMOVED whileInView */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }} // Changed from whileInView to animate
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setActiveCategory(category.id)}
                onHoverEnd={() => setActiveCategory(null)}
                className="relative group outline-none focus:outline-none h-full"
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
                      "absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    )}
                  />

                  <CardContent className="p-5 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center bg-primary/10",
                          )}
                        >
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
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
                            {tutorCounts[category.id]?.[idx] || 20}+ tutors
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

        {/* Popular Subjects Section - REMOVED whileInView */}
        <div className="mt-16">
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
                animate={{ opacity: 1, x: 0 }} // Changed from whileInView to animate
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border hover:border-primary/30 transition-colors bg-card backdrop-blur-sm">
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
                      <Badge className="bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-0">
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
        <div className="mt-16">
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
                  <Button
                    size="lg"
                    className="gap-2 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
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
