// src/components/Dashboard/Admin/DashboardAdminRoot.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  UserCheck,
  UserX,
  TrendingDown,
  TrendingUp as TrendUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  status: "BANNED" | "UNBANNED";
  createdAt: string;
  tutorProfiles?: {
    id: string;
    isFeatured: boolean;
    hourlyRate: number;
    subjects: Array<{
      subject: {
        name: string;
      };
    }>;
    reviews: Array<{
      rating: number;
    }>;
    bookings: Array<any>;
  };
}

interface Booking {
  id: string;
  student: { name: string; email: string };
  tutorProfile: {
    user: { name: string; email: string };
    hourlyRate: number;
    isFeatured: boolean;
  };
  subject: { name: string };
  booking_price: number;
  status: "PENDING" | "CONFIRM" | "COMPLETE" | "CANCELLED";
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  subjects?: Array<any>;
}

interface Subject {
  id: string;
  name: string;
  category_id: string;
  category?: { name: string };
}

interface DashboardAdminStatsClientProps {
  initialUsers: User[];
  initialBookings: Booking[];
  initialCategories: Category[];
  initialSubjects: Subject[];
}

// Chart colors – works perfectly in light & dark mode
const CHART_COLORS = {
  primary: "hsl(262 83% 58%)", // vivid violet/blue
  success: "hsl(142 71% 45%)", // green
  warning: "hsl(45 93% 47%)", // amber
  destructive: "hsl(0 84% 60%)", // red
  muted: "hsl(240 5% 64%)", // grey
};

// For Pie / multi‑series charts
const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.destructive,
  "hsl(190 90% 40%)", // teal
  "hsl(340 82% 52%)", // pink
];

export function DashboardAdminRoot({
  initialUsers,
  initialBookings,
  initialCategories,
  initialSubjects,
}: DashboardAdminStatsClientProps) {
  // Calculate statistics from props
  const stats = {
    users: {
      total: initialUsers.length,
      tutors: initialUsers.filter((u) => u.role === "TUTOR").length,
      students: initialUsers.filter((u) => u.role === "STUDENT").length,
      admins: initialUsers.filter((u) => u.role === "ADMIN").length,
      banned: initialUsers.filter((u) => u.status === "BANNED").length,
      active: initialUsers.filter((u) => u.status === "UNBANNED").length,
    },
    bookings: {
      total: initialBookings.length,
      pending: initialBookings.filter((b) => b.status === "PENDING").length,
      confirmed: initialBookings.filter((b) => b.status === "CONFIRM").length,
      completed: initialBookings.filter((b) => b.status === "COMPLETE").length,
      cancelled: initialBookings.filter((b) => b.status === "CANCELLED").length,
    },
    revenue: {
      total: initialBookings
        .filter((b) => b.status === "COMPLETE")
        .reduce((sum, b) => sum + Number(b.booking_price), 0),
      pending: initialBookings
        .filter((b) => b.status === "PENDING")
        .reduce((sum, b) => sum + Number(b.booking_price), 0),
      confirmed: initialBookings
        .filter((b) => b.status === "CONFIRM")
        .reduce((sum, b) => sum + Number(b.booking_price), 0),
    },
    tutors: {
      total: initialUsers.filter((u) => u.role === "TUTOR").length,
      featured: initialUsers.filter(
        (u) => u.role === "TUTOR" && u.tutorProfiles?.isFeatured === true,
      ).length,
      withBookings: initialUsers.filter(
        (u) =>
          u.role === "TUTOR" && (u.tutorProfiles?.bookings?.length || 0) > 0,
      ).length,
    },
    content: {
      categories: initialCategories.length,
      subjects: initialSubjects.length,
    },
  };

  // Chart data for booking status distribution
  const bookingStatusData = [
    {
      name: "Pending",
      value: stats.bookings.pending,
      fill: CHART_COLORS.warning,
    },
    {
      name: "Confirmed",
      value: stats.bookings.confirmed,
      fill: CHART_COLORS.primary,
    },
    {
      name: "Completed",
      value: stats.bookings.completed,
      fill: CHART_COLORS.success,
    },
    {
      name: "Cancelled",
      value: stats.bookings.cancelled,
      fill: CHART_COLORS.destructive,
    },
  ];

  // Chart data for user role distribution
  const userRoleData = [
    { name: "Students", value: stats.users.students },
    { name: "Tutors", value: stats.users.tutors },
    { name: "Admins", value: stats.users.admins },
  ];

  // Get recent users (last 10)
  const recentUsers = [...initialUsers]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  // Get recent bookings (last 10)
  const recentBookings = [...initialBookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  // Helper functions
  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; className: string; icon: any }
    > = {
      COMPLETE: {
        label: "Completed",
        className:
          "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
        icon: CheckCircle2,
      },
      CONFIRM: {
        label: "Confirmed",
        className:
          "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
        icon: CheckCircle2,
      },
      PENDING: {
        label: "Pending",
        className:
          "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
        icon: Clock,
      },
      CANCELLED: {
        label: "Cancelled",
        className:
          "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
        icon: XCircle,
      },
    };
    return (
      statusMap[status] || {
        label: status,
        className:
          "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
        icon: AlertCircle,
      }
    );
  };

  const getRoleBadge = (role: string) => {
    const roleMap: Record<
      string,
      { label: string; className: string; icon: any }
    > = {
      ADMIN: {
        label: "Admin",
        className:
          "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
        icon: Users,
      },
      TUTOR: {
        label: "Tutor",
        className:
          "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
        icon: GraduationCap,
      },
      STUDENT: {
        label: "Student",
        className:
          "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
        icon: Users,
      },
    };
    return (
      roleMap[role] || {
        label: role,
        className:
          "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
        icon: Users,
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-background">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time analytics and insights of your tutoring platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Badge>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {stats.users.total.toLocaleString()}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                <GraduationCap className="h-3 w-3 mr-1" />
                {stats.users.tutors} Tutors
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-600"
              >
                <Users className="h-3 w-3 mr-1" />
                {stats.users.students} Students
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {stats.bookings.total.toLocaleString()}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="outline"
                className="bg-yellow-500/10 text-yellow-600"
              >
                <Clock className="h-3 w-3 mr-1" />
                {stats.bookings.pending} Pending
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-600"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {stats.bookings.completed} Completed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {formatCurrency(stats.revenue.total)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              From {stats.bookings.completed} completed sessions
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Tutors
            </CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              {stats.tutors.featured}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Out of {stats.tutors.total} total tutors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Users</p>
                <p className="text-lg font-bold">{stats.users.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500/20" />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendUp className="h-3 w-3 text-green-500" />
              <span className="text-green-600">
                {((stats.users.active / stats.users.total) * 100).toFixed(1)}%
                active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Banned Users</p>
                <p className="text-lg font-bold text-red-600">
                  {stats.users.banned}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-500/20" />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-red-600">
                {((stats.users.banned / stats.users.total) * 100).toFixed(1)}%
                banned
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="text-lg font-bold">{stats.content.categories}</p>
              </div>
              <div className="h-8 w-8 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Subjects</p>
                <p className="text-lg font-bold">{stats.content.subjects}</p>
              </div>
              <div className="h-8 w-8 text-purple-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Booking Status Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Booking Status Distribution
            </CardTitle>
            <CardDescription>Current breakdown of all bookings</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {stats.bookings.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bookingStatusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" name="Count">
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No booking data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Role Pie Chart */}
        {/* User Role Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Roles</CardTitle>
            <CardDescription>Distribution of platform users</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {stats.users.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(Number(percent) * 100).toFixed(0)}%`
                    }
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No user data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-yellow-500" />
              <Badge className="bg-yellow-500/10 text-yellow-600">
                Pending Revenue
              </Badge>
            </div>
            <p className="text-xl sm:text-2xl font-bold">
              {formatCurrency(stats.revenue.pending)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.bookings.pending} pending bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <Badge className="bg-green-500/10 text-green-600">
                Confirmed Revenue
              </Badge>
            </div>
            <p className="text-xl sm:text-2xl font-bold">
              {formatCurrency(stats.revenue.confirmed)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.bookings.confirmed} confirmed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-4 w-4 text-purple-500" />
              <Badge className="bg-purple-500/10 text-purple-600">
                Completed Revenue
              </Badge>
            </div>
            <p className="text-xl sm:text-2xl font-bold">
              {formatCurrency(stats.revenue.total)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.bookings.completed} completed bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      {recentUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Recent Users
            </CardTitle>
            <CardDescription>
              Latest 10 users who joined the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => {
                    const role = getRoleBadge(user.role);
                    const RoleIcon = role.icon;
                    return (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-sm">{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "flex items-center gap-1 w-fit",
                              role.className,
                            )}
                          >
                            <RoleIcon className="h-3 w-3" />
                            {role.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.status === "BANNED" ? (
                            <Badge
                              variant="destructive"
                              className="flex items-center gap-1 w-fit"
                            >
                              <UserX className="h-3 w-3" /> Banned
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-600 flex items-center gap-1 w-fit"
                            >
                              <UserCheck className="h-3 w-3" /> Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {recentUsers.map((user) => {
                const role = getRoleBadge(user.role);
                const RoleIcon = role.icon;
                return (
                  <Card key={user.id} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "flex items-center gap-1",
                            role.className,
                          )}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {role.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {user.status === "BANNED" ? (
                            <Badge
                              variant="destructive"
                              className="flex items-center gap-1"
                            >
                              <UserX className="h-3 w-3" /> Banned
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-600 flex items-center gap-1"
                            >
                              <UserCheck className="h-3 w-3" /> Active
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Bookings
            </CardTitle>
            <CardDescription>
              Latest booking activities on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking) => {
                    const status = getStatusBadge(booking.status);
                    const StatusIcon = status.icon;
                    return (
                      <TableRow key={booking.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {booking.student.name}
                        </TableCell>
                        <TableCell>{booking.tutorProfile.user.name}</TableCell>
                        <TableCell>{booking.subject.name}</TableCell>
                        <TableCell className="font-medium text-primary">
                          {formatCurrency(booking.booking_price)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "flex items-center gap-1 w-fit",
                              status.className,
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(booking.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {recentBookings.map((booking) => {
                const status = getStatusBadge(booking.status);
                const StatusIcon = status.icon;
                return (
                  <Card key={booking.id} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{booking.student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            with {booking.tutorProfile.user.name}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "flex items-center gap-1",
                            status.className,
                          )}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Subject
                          </p>
                          <p className="font-medium">{booking.subject.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Price</p>
                          <p className="font-bold text-primary">
                            {formatCurrency(booking.booking_price)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(booking.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
