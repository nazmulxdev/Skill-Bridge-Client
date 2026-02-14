"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../Theme/ModeToggle";
import BrandLogo from "../WebLogo/BrandLogo";
import { Badge } from "@/components/ui/badge";
import { getAuthSession } from "@/actions/auth.action";
import { Role } from "@/types";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tutors", href: "/tutors" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [data, setData] = useState<{ user?: { role: Role } } | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    (async () => {
      const { data, error } = await getAuthSession();
      setData(data);
      setError(error);
      setLoading(false);
    })();
  }, []);

  // Don't render until after hydration to prevent mismatch
  if (!mounted) {
    return null;
  }

  const role = data?.user?.role as Role;
  const user = data?.user;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getDashboardLink = () => ({
    name: "Dashboard",
    href: `/dashboard`,
  });

  // Only show dashboard link if user is authenticated
  const allLinks = user ? [...navLinks, user && getDashboardLink()] : navLinks;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <BrandLogo />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {allLinks.map((link) => {
              const active = isActive(link.href);
              const isDashboard = link.name === "Dashboard";

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors group flex items-center gap-2",
                    active
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.name}
                  {isDashboard && role && (
                    <Badge
                      variant="outline"
                      className="text-[10px] h-4 px-1 bg-primary/10 text-primary"
                    >
                      {String(role).toLowerCase()}
                    </Badge>
                  )}
                  <span
                    className={cn(
                      "absolute left-0 -bottom-1 h-[2px] bg-primary transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />

            {!loading && user ? (
              <>
                <Button asChild>
                  <Link href="/api/auth/signout">Sign Out</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          open ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => setOpen(false)}
      />

      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
          <span className="font-semibold">Menu</span>
          <button onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-8 space-y-6">
          {allLinks.map((link) => {
            const isDashboard = link.name === "Dashboard";
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between text-base font-medium text-muted-foreground hover:text-foreground"
              >
                <span>{link.name}</span>
                {isDashboard && role && (
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
                    {String(role).toLowerCase()}
                  </Badge>
                )}
              </Link>
            );
          })}

          <div className="pt-6 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <ModeToggle />
            </div>

            {!loading && user ? (
              <>
                <Button className="w-full" asChild>
                  <Link href="/api/auth/signout">Sign Out</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
