import Link from "next/link";
import { Twitter, Youtube, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BrandLogo from "../WebLogo/BrandLogo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 py-8 md:py-10">
        {/* Main Footer Content - Centered */}
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo Section */}
          <div className="space-y-4">
            <div className="inline-flex p-3 rounded-full bg-primary/10 dark:bg-primary/20 ring-1 ring-primary/20 dark:ring-primary/30">
              <BrandLogo />
            </div>
            <div className="space-y-2">
              <p className="text-lg  max-w-xl mx-auto leading-relaxed">
                Bridging the gap between knowledge and success. Join thousands
                of learners and expert tutors worldwide.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground/90">
              <Link
                href="/about"
                className="hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <span>•</span>
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                href="/contact"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
            {/* Social Links */}
            <nav className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                {/* Twitter */}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-muted-foreground transition-all duration-300"
                  asChild
                >
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </Button>

                {/* YouTube */}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-muted-foreground transition-all duration-300"
                  asChild
                >
                  <Link
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube className="h-5 w-5" />
                    <span className="sr-only">YouTube</span>
                  </Link>
                </Button>

                {/* LinkedIn */}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-muted-foreground transition-all duration-300"
                  asChild
                >
                  <Link
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </Button>

                {/* GitHub */}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-border/50 bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-muted-foreground transition-all duration-300"
                  asChild
                >
                  <Link
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
              </div>
            </nav>
            <p className="text-xs">
              © {currentYear} Skill Bridge. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
