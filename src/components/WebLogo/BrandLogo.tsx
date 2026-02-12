import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function BrandLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 group">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors" />
        <GraduationCap className="relative h-8 w-8 text-primary" />
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        Skill Bridge
      </span>
    </Link>
  );
}
