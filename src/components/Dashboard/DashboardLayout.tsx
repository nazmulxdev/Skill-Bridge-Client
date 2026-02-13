"use client";

import { useState } from "react";
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
  MessageSquare,
  UserCircle,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export enum ERole {
  STUDENT = "student",
  TUTOR = "tutor",
  ADMIN = "admin",
}

interface DashboardClientWrapperProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  student: React.ReactNode;
  tutor: React.ReactNode;
  userRole: string;
}

export function DashboardClientWrapper({
  children,
  admin,
  student,
  tutor,
  userRole,
}: DashboardClientWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // parallel routes
  const renderContent = () => {
    switch (userRole) {
      case "admin":
        return admin;
      case "student":
        return student;
      case "tutor":
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
      student: [
        { name: "Find Slots", href: "/student/slots", icon: Calendar },
        { name: "My Bookings", href: "/student/bookings", icon: Clock },
        { name: "My Tutors", href: "/student/tutors", icon: Users },
        { name: "Reviews", href: "/student/reviews", icon: Star },
        { name: "Messages", href: "/student/messages", icon: MessageSquare },
      ],
      tutor: [
        { name: "My Slots", href: "/tutor/slots", icon: Calendar },
        { name: "Bookings", href: "/tutor/bookings", icon: Clock },
        { name: "Earnings", href: "/tutor/earnings", icon: DollarSign },
        { name: "Reviews", href: "/tutor/reviews", icon: Star },
        { name: "Students", href: "/tutor/students", icon: Users },
        { name: "Messages", href: "/tutor/messages", icon: MessageSquare },
      ],
      admin: [
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { name: "Students", href: "/dashboard/admin/students", icon: Users }, // Fixed: was /admin/tutor
        { name: "All Slots", href: "/admin/slots", icon: Calendar },
        { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
        { name: "Reports", href: "/admin/reports", icon: Shield },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ],
    };
    return [...baseNav, ...(roleNav[userRole as keyof typeof roleNav] || [])];
  };

  const navigation = getNavigation();

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
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">John Doe</p>
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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
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

            {/* Show current role for testing */}
            <Badge
              variant="outline"
              className="hidden md:inline-flex bg-primary/10 text-primary"
            >
              Testing: {userRole}
            </Badge>
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
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
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
