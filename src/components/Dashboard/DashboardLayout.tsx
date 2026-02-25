"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import BrandLogo from "../WebLogo/BrandLogo";
import { ModeToggle } from "../Theme/ModeToggle";
import { authClientService } from "@/services/authService.client";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  student: React.ReactNode;
  tutor: React.ReactNode;
  userRole: string;
  userData?: {
    name: string;
    email: string;
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
  const pathname = usePathname();

  // handle logout

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await authClientService.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
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
        {
          name: "Analytics",
          href: "/dashboard/admin/analytics",
          icon: BarChart3,
        },
        { name: "Students", href: "/dashboard/admin/students", icon: Users }, // Fixed: was /admin/tutor
        { name: "All Slots", href: "/dashboard/admin/slots", icon: Calendar },
        {
          name: "Transactions",
          href: "/dashboard/admin/transactions",
          icon: CreditCard,
        },
        { name: "Reports", href: "/dashboard/admin/reports", icon: Shield },
        { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
        { name: "Profile", href: "/dashboard/admin/profile", icon: User },
      ],
    };
    return [...baseNav, ...(roleNav[userRole as keyof typeof roleNav] || [])];
  };

  const navigation = getNavigation();

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
                <AvatarFallback>
                  {userData?.name.slice(0, 2) || "NA"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {userData?.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole}
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-success/10 text-success border-success/20"
              >
                Online
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
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
                  {item.name === "Messages" && (
                    <Badge className="ml-auto bg-destructive/10 text-destructive border-destructive/20">
                      3
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border/40 space-y-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all hover:cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
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
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="lg:hidden">
              <BrandLogo />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {userData?.name.slice(0, 2) || "NA"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{userData?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    className="flex w-full"
                    href={`/dashboard/${userRole.toLowerCase()}/profile`}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <div
                    className="flex hover:cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </div>
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
