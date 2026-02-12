import Link from "next/link";
import BrandLogo from "../WebLogo/BrandLogo";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <BrandLogo />
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/tutors" className="hover:text-primary">
              Tutors
            </Link>
            <Link href="/how-it-works" className="hover:text-primary">
              How it Works
            </Link>
            <Link href="/pricing" className="hover:text-primary">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Skill Bridge
          </p>
        </div>
      </div>
    </footer>
  );
}
