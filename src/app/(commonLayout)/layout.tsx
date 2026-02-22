import { Footer } from "@/components/Footer/Footer";
import Navbar from "@/components/NavBar/NavBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Skill Bridge",
    default: "Skill Bridge",
  },
  description: "Connect with expert tutors and enhance your skills",
};

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
