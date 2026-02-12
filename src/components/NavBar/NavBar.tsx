"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../Theme/ModeToggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              YourBrand
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors group",
                    active
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.name}

                  {/* Animated Underline */}
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

            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>

            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300",
          open ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => setOpen(false)}
      />

      {/* Side Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
          <span className="font-semibold">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-8 space-y-6">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block text-base font-medium transition-colors",
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-6 border-t border-border space-y-4">
            <ModeToggle />

            <Button variant="ghost" className="w-full" asChild>
              <Link href="/login">Login</Link>
            </Button>

            <Button className="w-full" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
