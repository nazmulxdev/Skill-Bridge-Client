"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Slide data
const slides = [
  {
    id: 1,
    title: "Learn from Expert Tutors",
    description:
      "Connect with top educators worldwide for personalized 1-on-1 sessions",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
    badge: "Featured",
    color: "from-blue-600/20 to-purple-600/20",
    icon: GraduationCap,
    stats: [
      { label: "Expert Tutors", value: "500+", icon: Users },
      { label: "Success Rate", value: "98%", icon: TrendingUp },
    ],
    cta: { text: "Find a Tutor", href: "/tutors" },
  },
  {
    id: 2,
    title: "Flexible Learning Schedule",
    description: "Book sessions that fit your schedule - anytime, anywhere",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    badge: "Popular",
    color: "from-green-600/20 to-teal-600/10",
    icon: Clock,
    stats: [
      { label: "Daily Sessions", value: "1,200+", icon: Clock },
      { label: "Avg Rating", value: "4.9", icon: Star },
    ],
    cta: { text: "Browse Slots", href: "/slots" },
  },
  {
    id: 3,
    title: "Achieve Your Goals Faster",
    description: "Personalized learning paths designed for your success",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    badge: "New",
    color: "from-orange-600/20 to-red-600/20",
    icon: Award,
    stats: [
      { label: "Courses", value: "50+", icon: BookOpen },
      { label: "Happy Students", value: "10k+", icon: Users },
    ],
    cta: { text: "Start Learning", href: "/signup" },
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Pause auto-slide on hover
  const pauseAutoSlide = () => setIsAutoPlaying(false);
  const resumeAutoSlide = () => setIsAutoPlaying(true);

  const slide = slides[currentSlide];

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      {/* Decorative Orbs */}
      <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-success/10 blur-3xl animate-pulse-slower" />

      <div
        className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] w-full"
        onMouseEnter={pauseAutoSlide}
        onMouseLeave={resumeAutoSlide}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-r",
                  slide.color,
                  "via-background/80 to-background",
                )}
              />
            </div>

            {/* Content Container */}
            <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-left space-y-6"
                >
                  {/* Badge */}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20 backdrop-blur-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      {slide.badge}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                    {slide.title.split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="inline-block mr-3"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </h1>

                  {/* Description */}
                  <p className="text-lg md:text-xl  max-w-xl leading-relaxed">
                    {slide.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 pt-4">
                    {slide.stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50">
                          <stat.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs">{stat.label}</p>
                          <p className="text-sm font-semibold">{stat.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-wrap gap-4 pt-4"
                  >
                    <Button
                      size="lg"
                      className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                      asChild
                    >
                      <Link href={slide.cta.href}>
                        <span className="relative z-10">{slide.cta.text}</span>
                        <slide.icon className="relative z-10 ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      </Link>
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 backdrop-blur-sm"
                      asChild
                    >
                      <Link href="/how-it-works">Learn More</Link>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Right Content - Floating Cards (visible on larger screens) */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="hidden lg:block relative"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {/* Sample cards that change with slides */}
                    {[1, 2, 3, 4].map((item) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + item * 0.1 }}
                        className={cn(
                          "p-4 rounded-2xl backdrop-blur-xl border border-primary/50",
                          "bg-white/50 dark:bg-black/10",
                          item % 2 === 0 ? "translate-y-8" : "",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/40 flex items-center justify-center">
                            <slide.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs">Session {item}</p>
                            <p className="text-sm font-semibold">
                              ${45 + item * 5}/hr
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Slide Indicators */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50">
            {slides.map((_, index) => (
              <Button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === currentSlide
                    ? "w-8 bg-primary"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            fillOpacity="0.05"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            className="text-primary"
          />
        </svg>
      </div>
    </section>
  );
}
