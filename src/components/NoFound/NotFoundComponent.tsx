"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundComponent() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex items-center justify-center px-6">
      {/* Gradient Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 h-[500px] w-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[400px] bg-secondary/30 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="max-w-2xl w-full text-center transition-all duration-700 opacity-100 translate-y-0">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-border bg-muted/60 backdrop-blur px-4 py-1.5 text-sm text-muted-foreground">
          404 • Page Not Found
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-5xl sm:text-6xl font-bold tracking-tight">
          This page vanished.
        </h1>

        {/* Description */}
        <p className="mt-6 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          The page you’re looking for might have been removed, renamed, or is
          temporarily unavailable. Let’s guide you back to the right place.
        </p>

        {/* Glass Card */}
        <div className="relative mt-12">
          <div className="absolute inset-0 rounded-3xl bg-border/30 blur-xl" />
          <div className="relative bg-card/70 backdrop-blur-xl border border-border rounded-3xl shadow-xl p-12">
            <span className="text-8xl sm:text-9xl font-extrabold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              404
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="px-8" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
