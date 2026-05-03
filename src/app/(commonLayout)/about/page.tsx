// src/app/(commonLayout)/about/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Globe,
  Award,
  Target,
  Heart,
  ArrowRight,
  Star,
  CheckCircle,
  Zap,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - SkillBridge",
  description:
    "Learn about SkillBridge's mission to connect students with expert tutors worldwide",
};

const stats = [
  { icon: Users, label: "Active Students", value: "10,000+" },
  { icon: GraduationCap, label: "Expert Tutors", value: "500+" },
  { icon: Globe, label: "Countries", value: "30+" },
  { icon: Award, label: "Success Rate", value: "95%" },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "Democratizing education by connecting learners with world-class tutors, making quality learning accessible to everyone, everywhere.",
  },
  {
    icon: Heart,
    title: "Our Vision",
    description:
      "Creating a world where anyone can master any skill from the best instructors, breaking barriers of location and cost.",
  },
  {
    icon: Shield,
    title: "Our Promise",
    description:
      "Every tutor is rigorously vetted. Every session is impactful. Every student achieves their learning goals.",
  },
];

const features = [
  {
    icon: Zap,
    title: "Instant Booking",
    description:
      "Book sessions with top tutors in under 60 seconds. No lengthy processes.",
  },
  {
    icon: Shield,
    title: "Verified Tutors",
    description:
      "All tutors undergo background checks and skill verification before joining.",
  },
  {
    icon: Star,
    title: "Quality Guaranteed",
    description:
      "Not satisfied? Get a full refund. We stand behind every session.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10 dark:from-primary/10 dark:via-background dark:to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent dark:from-primary/10" />

        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Zap className="w-4 h-4 text-primary" />
              <span>Empowering learners worldwide</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Bridging the Gap Between{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Learners
              </span>{" "}
              and{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Experts
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              We're on a mission to make quality education accessible to
              everyone through personalized, one-on-one tutoring with the
              world's best instructors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
              >
                Start Learning Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/tutors"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-border hover:border-primary/50 font-semibold transition-all hover:bg-muted/50"
              >
                Browse Tutors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-16 border-y bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                From a Simple Idea to a{" "}
                <span className="text-primary">Global Movement</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  SkillBridge was born in 2023 when our founder experienced
                  firsthand the challenges of finding quality tutors in
                  specialized subjects. What started as a simple solution has
                  grown into a global platform connecting thousands of students
                  with expert tutors.
                </p>
                <p className="leading-relaxed">
                  We believe every student deserves personalized attention. Our
                  platform breaks down geographical barriers, allowing learners
                  to access the best tutors regardless of location.
                </p>
                <div className="flex items-center gap-2 text-sm mt-6">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>50+ Subjects Available</span>
                  <CheckCircle className="w-5 h-5 text-primary ml-4" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 dark:from-primary/20 dark:via-primary/5 dark:to-secondary/10 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <GraduationCap className="w-24 h-24 md:w-32 md:h-32 text-primary mx-auto mb-4" />
                    <div className="text-2xl font-bold text-primary">
                      Since 2023
                    </div>
                  </div>
                </div>
                {/* Decorative dots */}
                <div className="absolute top-8 right-8 w-4 h-4 rounded-full bg-primary/40" />
                <div className="absolute bottom-12 left-8 w-6 h-6 rounded-full bg-primary/30" />
                <div className="absolute top-1/2 right-12 w-3 h-3 rounded-full bg-primary/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Drives Us Forward
            </h2>
            <p className="text-muted-foreground">
              Our core values shape every decision we make and every feature we
              build
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-card border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Success
            </h2>
            <p className="text-muted-foreground">
              Everything you need to accelerate your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-5">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 md:p-16 text-center shadow-2xl shadow-primary/25">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-primary-foreground/90 text-lg mb-8 max-w-xl mx-auto">
                Join 10,000+ students already learning on SkillBridge. First
                session is free!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-background text-foreground font-semibold hover:opacity-90 transition-all hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-all"
                >
                  Talk to Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
