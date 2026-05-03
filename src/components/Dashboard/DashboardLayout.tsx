"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Star,
  CreditCard,
  BarChart3,
  Shield,
  UserCircle,
  User,
  Book,
  GraduationCapIcon,
  BookAIcon,
  Paperclip,
  MessageSquare,
  Bell,
  HelpCircle,
  Keyboard,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import BrandLogo from "../WebLogo/BrandLogo";
import { ModeToggle } from "../Theme/ModeToggle";
import { authClientService } from "@/services/authService.client";
import { toast } from "sonner";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  student: React.ReactNode;
  tutor: React.ReactNode;
  userRole: string;
  userData?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function DashboardClientWrapper({
  children,
  admin,
  student,
  tutor,
  userRole,
  userData,
}: DashboardClientWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [notifications] = useState(3); // This could come from a notifications service
  const pathname = usePathname();
  const router = useRouter();

  // handle logout
  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await authClientService.signOut();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Failed to sign out. Please try again.");
      setIsSigningOut(false);
    }
  };

  // parallel routes
  const renderContent = () => {
    switch (userRole) {
      case "ADMIN":
        return admin;
      case "STUDENT":
        return student;
      case "TUTOR":
        return tutor;
      default:
        return children;
    }
  };

  // Navigation based on role
  const getNavigation = () => {
    const baseNav = [
      { name: "Dashboard", href: `/dashboard`, icon: LayoutDashboard },
    ];

    // role base dashboard routes
    const roleNav = {
      STUDENT: [
        { name: "Profile", href: "/dashboard/student/profile", icon: User },
        { name: "All Tutors", href: "/dashboard/student/tutors", icon: Users },
        {
          name: "Sessions",
          href: "/dashboard/student/bookings",
          icon: Clock,
        },
        { name: "Reviews", href: "/dashboard/student/reviews", icon: Star },
      ],
      TUTOR: [
        { name: "Profile", href: "/dashboard/tutor/profile", icon: User },
        {
          name: "Education",
          href: "/dashboard/tutor/education",
          icon: GraduationCapIcon,
        },
        {
          name: "Subjects",
          href: "/dashboard/tutor/subjects",
          icon: Book,
        },
        {
          name: "Availability",
          href: "/dashboard/tutor/availability",
          icon: Calendar,
        },
        {
          name: "Time Slots",
          href: "/dashboard/tutor/timeSlots",
          icon: Calendar,
        },
        { name: "Bookings", href: "/dashboard/tutor/bookings", icon: Clock },
        { name: "Reviews", href: "/dashboard/tutor/reviews", icon: Star },
      ],
      ADMIN: [
        { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
        {
          name: "Manage Tutors",
          href: "/dashboard/admin/tutors",
          icon: GraduationCapIcon,
        },
        {
          name: "Manage Categories",
          href: "/dashboard/admin/categories",
          icon: BookAIcon,
        },
        {
          name: "Manage Subjects",
          href: "/dashboard/admin/subjects",
          icon: Book,
        },
        {
          name: "Bookings",
          href: "/dashboard/admin/bookings",
          icon: Calendar,
        },
      ],
    };
    return [...baseNav, ...(roleNav[userRole as keyof typeof roleNav] || [])];
  };

  const navigation = getNavigation();

  // Get role-specific profile links
  const getProfileLinks = () => {
    const roleProfilePath = {
      STUDENT: "/dashboard/student/profile",
      TUTOR: "/dashboard/tutor/profile",
      ADMIN: "/dashboard/admin/profile",
    };
    return (
      roleProfilePath[userRole as keyof typeof roleProfilePath] || "/dashboard"
    );
  };

  // Get role-specific settings links
  const getSettingsLinks = () => {
    const roleSettingsPath = {
      STUDENT: "/dashboard/student/settings",
      TUTOR: "/dashboard/tutor/settings",
      ADMIN: "/dashboard/admin/settings",
    };
    return (
      roleSettingsPath[userRole as keyof typeof roleSettingsPath] ||
      "/dashboard/settings"
    );
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-card/80 backdrop-blur-xl border-r border-border/40
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border/40">
            <BrandLogo />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-border/40">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {userData?.name?.slice(0, 2).toUpperCase() || "NA"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {userData?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userData?.email || "user@example.com"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0 bg-primary/10 text-primary border-primary/20 capitalize"
                  >
                    {userRole.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                    transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }
                  `}
                >
                  <item.icon
                    className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "group-hover:text-primary transition-colors"}`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border/40 space-y-2">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="h-5 w-5" />
              <span>{isSigningOut ? "Signing out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 bg-card/80 backdrop-blur-xl border-b border-border/40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-accent/50"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="lg:hidden">
              <BrandLogo />
            </div>

            {/* Page Title - Optional */}
            <div className="hidden sm:block">
              <h1 className="text-sm font-medium text-muted-foreground">
                {navigation.find((item) => item.href === pathname)?.name ||
                  "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent/50"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                  {notifications}
                </span>
              )}
            </Button>

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 px-2 hover:bg-accent/50"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {userData?.name?.slice(0, 2).toUpperCase() || "NA"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {userData?.name || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {userRole.toLowerCase()}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-72 p-2"
                align="end"
                sideOffset={8}
              >
                {/* User Info Header */}
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-3 p-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {userData?.name?.slice(0, 2).toUpperCase() || "NA"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {userData?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {userData?.email || "user@example.com"}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-1 text-xs px-2 py-0 bg-primary/10 text-primary border-primary/20 capitalize"
                      >
                        {userRole.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Quick Actions */}
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href={getProfileLinks()}
                      className="flex items-center gap-3"
                    >
                      <User className="h-4 w-4" />
                      <span>View Profile</span>
                      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard" className="flex items-center gap-3">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                      <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Help & Support */}
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/about" className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4" />
                      <span>About Us</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/contact" className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4" />
                      <span>Contact</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="cursor-pointer text-destructive hover:!bg-destructive/10 hover:!text-destructive focus:!bg-destructive/10 focus:!text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                  <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{renderContent()}</main>
      </div>
    </div>
  );
}
