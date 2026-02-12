import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Sparkles } from "lucide-react";
import { AuthCard } from "@/components/AuthLayout/AuthCard";

export const metadata: Metadata = {
  title: "Create Account | Skill Bridge",
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Join Skill Bridge as a student or tutor and start your learning journey"
    >
      <form className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="hello@skillbridge.com"
              className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            ></button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
        >
          Create Account
        </Button>
      </form>

      {/* Social Signup */}

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-all"
        >
          Sign in
        </Link>
      </p>

      {/* Tutor Promotion */}
      <div className="relative mt-8 p-4 rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20">
        <div className="absolute -top-2 -right-2">
          <div className="relative">
            <div className="absolute inset-0 bg-warning/30 blur-md rounded-full" />
            <Sparkles className="relative h-4 w-4 text-warning" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            ✨ Want to become a tutor?
          </span>{" "}
          Join as a tutor and start sharing your knowledge while earning.
        </p>
      </div>
    </AuthCard>
  );
}
