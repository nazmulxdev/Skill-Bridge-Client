// src/app/(authLayout)/login/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight, Sparkles, User } from "lucide-react";
import { AuthCard } from "@/components/AuthLayout/AuthCard";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const formData = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Please enter valid password"),
});

// Demo credentials
const DEMO_STUDENT = {
  email: "demo@skill-bridge.com",
  password: "12345678",
  name: "Demo Student",
};

const DEMO_TUTOR = {
  email: "demo-tutor@skill-bridge.com",
  password: "12345678",
  name: "Demo Tutor",
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formData,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Signing in...");

      const payload = {
        ...value,
        callbackURL: redirectPath,
        rememberMe: true,
      };

      try {
        const { data, error } = await authClient.signIn.email(payload);
        if (error) {
          toast.error(error.message || "Login failed. Please try again.", {
            id: toastId,
          });
          return;
        }
        if (data) {
          toast.success("Signed in successfully!", { id: toastId });
          router.push(redirectPath);
          router.refresh();
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again.", { id: toastId });
      }
    },
  });

  // Handle demo login
  const handleDemoLogin = async (type: "student" | "tutor") => {
    const credentials = type === "student" ? DEMO_STUDENT : DEMO_TUTOR;
    const toastId = toast.loading(`Signing in as ${type}...`);

    try {
      const { data, error } = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
        callbackURL: redirectPath,
        rememberMe: true,
      });

      if (error) {
        toast.error(error.message || "Demo login failed", { id: toastId });
        return;
      }

      if (data) {
        toast.success(`Signed in as ${type}!`, { id: toastId });
        router.push(redirectPath);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Demo login failed. Please try again.", { id: toastId });
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <form
        id="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <FieldGroup>
          {/* email */}
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel
                    className="text-sm font-medium"
                    htmlFor={field.name}
                  >
                    Email
                  </FieldLabel>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="hello@skillbridge.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {/* password */}
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel
                    className="text-sm font-medium"
                    htmlFor={field.name}
                  >
                    Password
                  </FieldLabel>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

        <Button
          type="submit"
          form="login-form"
          className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:cursor-pointer"
        >
          Sign In
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      {/* Demo Login Section */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Quick Demo Access
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Demo Student Button */}
        <Button
          variant="outline"
          onClick={() => handleDemoLogin("student")}
          className="w-full h-12 relative group overflow-hidden border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Demo Student</p>
              <p className="text-xs text-muted-foreground">Try as a student</p>
            </div>
            <Sparkles className="h-4 w-4 text-yellow-500 group-hover:animate-pulse" />
          </div>
        </Button>
        <Button
          variant="outline"
          onClick={() => handleDemoLogin("tutor")}
          className="w-full h-12 relative group overflow-hidden border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Demo Tutor</p>
              <p className="text-xs text-muted-foreground">Try as a tutor</p>
            </div>
            <Sparkles className="h-4 w-4 text-yellow-500 group-hover:animate-pulse" />
          </div>
        </Button>
      </div>

      {/* Demo Credentials Info */}
      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          <span className="font-medium text-foreground">Demo Student:</span>{" "}
          {DEMO_STUDENT.email} | Pass: {DEMO_STUDENT.password}
        </p>
      </div>
      {/* Demo Credentials Info */}
      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          <span className="font-medium text-foreground">Demo Tutor:</span>{" "}
          {DEMO_TUTOR.email} | Pass: {DEMO_TUTOR.password}
        </p>
      </div>

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
