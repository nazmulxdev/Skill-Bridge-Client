// components/NavBar/NavbarClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../Theme/ModeToggle";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "../AuthLayout/SignoutButton";

interface NavbarClientProps {
  user?: any;
  role?: string;
  navLinks: Array<{ name: string; href: string }>;
}

export default function NavbarClient({
  user,
  role,
  navLinks,
}: NavbarClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden text-muted-foreground hover:text-foreground"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden",
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
          {navLinks.map((link) => {
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

            {user ? (
              <>
                <SignOutButton />
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
