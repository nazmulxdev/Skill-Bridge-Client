import Link from "next/link";
import { getAuthSession } from "@/actions/auth.action";
import BrandLogo from "../WebLogo/BrandLogo";
import { Badge } from "../ui/badge";
import { ModeToggle } from "../Theme/ModeToggle";
import { Button } from "../ui/button";
import NavbarClient from "./NavBarClient";
import { SignOutButton } from "../AuthLayout/SignoutButton";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tutors", href: "/tutors" },
  { name: "Contact", href: "/contact" },
];

export default async function Navbar() {
  const { data } = await getAuthSession();
  const user = data?.user;
  const role = user?.role;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 ">
      <div className="mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <BrandLogo />

        {/* Desktop Nav  */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-sm font-medium text-muted-foreground hover:text-foreground group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 h-[2px] bg-primary transition-all duration-300 w-0 group-hover:w-full" />
            </Link>
          ))}

          {/* Dashboard link  */}
          {user && (
            <Link
              href="/dashboard"
              className="relative text-sm font-medium text-muted-foreground hover:text-foreground group flex items-center gap-2"
            >
              Dashboard
              {role && (
                <Badge
                  variant="outline"
                  className="text-[10px] h-4 px-1 bg-primary/10 text-primary"
                >
                  {role.toLowerCase()}
                </Badge>
              )}
              <span className="absolute left-0 -bottom-1 h-[2px] bg-primary transition-all duration-300 w-0 group-hover:w-full" />
            </Link>
          )}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />

          {user ? (
            <SignOutButton />
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

        {/* Mobile Menu Button  */}
        <NavbarClient user={user} role={role} navLinks={navLinks} />
      </div>
    </header>
  );
}
