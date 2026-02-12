import { AuthLayoutClient } from "@/components/AuthLayout/AuthLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Skill Bridge",
    default: "Authentication | Skill Bridge",
  },
  description: "Connect with expert tutors and enhance your skills",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
