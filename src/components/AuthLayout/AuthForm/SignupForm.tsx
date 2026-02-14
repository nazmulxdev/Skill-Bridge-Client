"use client";
import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Sparkles, ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/AuthLayout/AuthCard";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const formData = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    role: z.enum(["STUDENT", "TUTOR"], "Please give valid role."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const metadata: Metadata = {
  title: "Create Account | Skill Bridge",
};

export default function SignupForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "STUDENT",
    },
    validators: {
      onSubmit: formData,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Register user");
      const payload = {
        ...value,
        rememberMe: true,
      };
      try {
        const { data, error } = await authClient.signUp.email(payload);
        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }
        if (data) {
          toast.success(`${payload.role} registration successfully`, {
            id: toastId,
          });
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message, { id: toastId });
      }
    },
  });
  return (
    <AuthCard
      title="Create your account"
      description="Join Skill Bridge as a student or tutor and start your learning journey"
    >
      <form
        id="signup-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <FieldGroup>
          {/* Name */}
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel
                    className="text-sm font-medium"
                    htmlFor={field.name}
                  >
                    Name
                  </FieldLabel>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Full Name"
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
                      placeholder="email"
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

          {/* Role Selection - Radio Buttons */}
          <form.Field
            name="role"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel className="text-sm font-medium">
                    I want to join as
                  </FieldLabel>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {/* STUDENT Option */}
                    <div
                      className={
                        field.state.value === "STUDENT"
                          ? "relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all border-border/50 hover:border-primary/50 hover:bg-accent/50"
                      }
                      onClick={() => field.handleChange("STUDENT")}
                    >
                      <div className="flex h-5 items-center">
                        <input
                          type="radio"
                          name={field.name}
                          value="STUDENT"
                          checked={field.state.value === "STUDENT"}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="h-4 w-4 border-border text-primary focus:ring-primary/20"
                        />
                      </div>
                      <div className="flex flex-1">
                        <div>
                          <p className="text-sm font-medium">Student</p>
                          <p className="text-xs text-muted-foreground">
                            I want to learn
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* TUTOR Option */}
                    <div
                      className={
                        field.state.value === "TUTOR"
                          ? "relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all border-border/50 hover:border-primary/50 hover:bg-accent/50"
                      }
                      onClick={() => field.handleChange("TUTOR")}
                    >
                      <div className="flex h-5 items-center">
                        <input
                          type="radio"
                          name={field.name}
                          value="TUTOR"
                          checked={field.state.value === "TUTOR"}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="h-4 w-4 border-border text-primary focus:ring-primary/20"
                        />
                      </div>
                      <div className="flex flex-1">
                        <div>
                          <p className="text-sm font-medium">Tutor</p>
                          <p className="text-xs text-muted-foreground">
                            I want to teach
                          </p>
                        </div>
                      </div>
                    </div>
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
          {/*confirm  password */}

          <form.Field
            name="confirmPassword"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel
                    className="text-sm font-medium"
                    htmlFor={field.name}
                  >
                    Confirm Password
                  </FieldLabel>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="confirmPassword"
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
          form="signup-form"
          className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:cursor-pointer"
        >
          Create Account
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

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
