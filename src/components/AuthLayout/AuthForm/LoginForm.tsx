"use client";
import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/AuthLayout/AuthCard";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { env } from "@/env";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
};

const formData = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Please enter valid password"),
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  console.log(redirectPath);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formData,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating user");
      const payload = {
        ...value,
        callbackURL: redirectPath,
        rememberMe: true,
      };

      toast.loading("Please wait...", { id: toastId });

      try {
        const { data, error } = await authClient.signIn.email(payload);
        if (error) {
          toast.error("User login failed...", { id: toastId });
          return;
        }
        if (data) {
          toast.success("User login successfully...", { id: toastId });
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error("User login failed...", { id: toastId });
      }
    },
  });

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
