import { Metadata } from "next";
import LoginForm from "@/components/AuthLayout/AuthForm/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return <LoginForm />;
}
