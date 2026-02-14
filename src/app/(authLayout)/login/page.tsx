import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/AuthLayout/AuthCard";
import { Label } from "@/components/ui/label";
import LoginForm from "@/components/AuthLayout/AuthForm/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return <LoginForm />;
}
