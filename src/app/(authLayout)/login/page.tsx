import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/AuthLayout/AuthCard";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <form className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
        >
          Sign In
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-all"
        >
          Create account
        </Link>
      </p>
    </AuthCard>
  );
}
