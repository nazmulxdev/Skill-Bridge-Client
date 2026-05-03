"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  Menu,
  Star,
  DollarSign,
  BookOpen,
  TrendingUp,
  Video,
  CheckCircle,
  XCircle,
  Clock as PendingIcon,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StudentDashboardClientProps {
  student: any;
}

// Status configuration
const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: PendingIcon,
    color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
    badge: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  CONFIRM: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "text-green-600 bg-green-500/10 border-green-500/20",
    badge: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600 bg-red-500/10 border-red-500/20",
    badge: "bg-red-500/10 text-red-600 border-red-500/20",
  },
  COMPLETE: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
};

// Chart colors matching theme
const CHART_COLORS = {
  warning: "hsl(45 93% 47%)", // yellow
  primary: "hsl(var(--primary))",
  success: "hsl(142 71% 45%)", // green
  destructive: "hsl(0 84% 60%)", // red
};

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper to format time
const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export function DashboardRootPageClient({
  student,
}: StudentDashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate statistics
  const totalBookings = student.bookings?.length || 0;
  const pendingBookings =
    student.bookings?.filter((b: any) => b.status === "PENDING").length || 0;
  const confirmedBookings =
    student.bookings?.filter((b: any) => b.status === "CONFIRM").length || 0;
  const completedBookings =
    student.bookings?.filter((b: any) => b.status === "COMPLETE").length || 0;
  const cancelledBookings =
    student.bookings?.filter((b: any) => b.status === "CANCELLED").length || 0;

  const totalReviews = student.reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? (
          student.reviews.reduce(
            (acc: number, r: any) => acc + parseFloat(r.rating),
            0,
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  const totalSpent =
    student.bookings
      ?.filter((b: any) => b.status === "COMPLETE")
      .reduce((acc: number, b: any) => acc + parseFloat(b.booking_price), 0) ||
    0;

  const uniqueTutors = new Set(
    student.bookings?.map((b: any) => b.tutorProfile?.userId),
  ).size;

  // Booking status distribution for chart
  const bookingStatusData = [
    { name: "Pending", value: pendingBookings, fill: CHART_COLORS.warning },
    { name: "Confirmed", value: confirmedBookings, fill: CHART_COLORS.primary },
    { name: "Completed", value: completedBookings, fill: CHART_COLORS.success },
    {
      name: "Cancelled",
      value: cancelledBookings,
      fill: CHART_COLORS.destructive,
    },
  ];

  // Get upcoming sessions (confirmed and future)
  const upcomingSessions =
    student.bookings
      ?.filter(
        (b: any) =>
          b.status === "CONFIRM" &&
          b.timeSlot?.date &&
          new Date(b.timeSlot.date) >= new Date(),
      )
      .sort(
        (a: any, b: any) =>
          new Date(a.timeSlot.date).getTime() -
          new Date(b.timeSlot.date).getTime(),
      ) || [];

  // Get recent bookings
  const recentBookings =
    student.bookings
      ?.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5) || [];

  // Get recent reviews
  const recentReviews =
    student.reviews
      ?.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3) || [];

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <Button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-background border border-border shadow-md"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className=" mx-auto space-y-6">
          {/* Header with Welcome and Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {student.name}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your learning journey today.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card className="border-border/50 bg-card/50 hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Sessions
                    </p>
                    <p className="text-xl font-bold mt-1">{totalBookings}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 hover:shadow-md transition-all border-yellow-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-yellow-600">Pending</p>
                    <p className="text-xl font-bold mt-1 text-yellow-600">
                      {pendingBookings}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <PendingIcon className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 hover:shadow-md transition-all border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600">Confirmed</p>
                    <p className="text-xl font-bold mt-1 text-green-600">
                      {confirmedBookings}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 hover:shadow-md transition-all border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600">Completed</p>
                    <p className="text-xl font-bold mt-1 text-blue-600">
                      {completedBookings}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 hover:shadow-md transition-all border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-600">Reviews</p>
                    <p className="text-xl font-bold mt-1 text-purple-600">
                      {totalReviews}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 hover:shadow-md transition-all border-emerald-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-600">Spent</p>
                    <p className="text-xl font-bold mt-1 text-emerald-600">
                      ${totalSpent}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="bookings">All Bookings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Learning Hours
                        </p>
                        <p className="text-3xl font-bold">
                          {completedBookings * 1.5}h
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-primary/10">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-gradient-to-br from-yellow-500/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Unique Tutors
                        </p>
                        <p className="text-3xl font-bold">{uniqueTutors}</p>
                      </div>
                      <div className="p-3 rounded-full bg-yellow-500/10">
                        <Users className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-gradient-to-br from-green-500/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Avg. Rating Given
                        </p>
                        <p className="text-3xl font-bold">{averageRating}</p>
                      </div>
                      <div className="p-3 rounded-full bg-green-500/10">
                        <Star className="h-6 w-6 text-green-600 fill-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Status Chart */}
              {totalBookings > 0 && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Your Booking Status
                    </CardTitle>
                    <CardDescription>
                      Distribution of your sessions by status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
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
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="value" name="Sessions">
                          {bookingStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Sessions and Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Sessions */}
                <Card className="lg:col-span-2 border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Upcoming Sessions
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/dashboard/student/bookings">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {upcomingSessions.length > 0 ? (
                      <div className="space-y-3">
                        {upcomingSessions.slice(0, 3).map((booking: any) => (
                          <div
                            key={booking.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10">
                                  {booking.tutorProfile?.user?.name?.charAt(
                                    0,
                                  ) || "T"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {booking.tutorProfile?.user?.name ||
                                    "Unknown Tutor"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {booking.subject?.name}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {booking.timeSlot?.date
                                      ? formatDate(booking.timeSlot.date)
                                      : "TBD"}
                                  </span>
                                  <Clock className="h-3 w-3 ml-1" />
                                  <span>
                                    {booking.timeSlot?.startTime
                                      ? formatTime(booking.timeSlot.startTime)
                                      : "TBD"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-green-500/10 text-green-600"
                              >
                                Confirmed
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1"
                              >
                                <Video className="h-3 w-3" />
                                Join
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground">
                          No upcoming sessions
                        </p>
                        <Button asChild className="mt-4" size="sm">
                          <Link href="/dashboard/student/tutors">
                            Find a Tutor
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Learning Progress */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Learning Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Weekly Goal */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Weekly Goal</span>
                        <span className="font-medium">
                          {completedBookings * 1.5}h / 5h
                        </span>
                      </div>
                      <Progress
                        value={completedBookings * 30}
                        className="h-2"
                      />
                    </div>

                    {/* Subjects in Progress */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Recent Subjects</p>
                      {student.bookings
                        ?.slice(0, 3)
                        .map((booking: any, i: number) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{booking.subject?.name || "Unknown"}</span>
                              <span className="text-muted-foreground">
                                Completed
                              </span>
                            </div>
                            <Progress
                              value={100}
                              className="h-1.5 bg-green-500/20"
                            />
                          </div>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <p className="text-lg font-bold text-primary">
                          {uniqueTutors}
                        </p>
                        <p className="text-xs text-muted-foreground">Tutors</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <p className="text-lg font-bold text-green-600">
                          {completedBookings}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Completed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/dashboard/student/bookings">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {recentBookings.length > 0 ? (
                      <div className="space-y-3">
                        {recentBookings.map((booking: any) => {
                          const status =
                            statusConfig[
                              booking.status as keyof typeof statusConfig
                            ];
                          const StatusIcon = status?.icon;
                          return (
                            <div
                              key={booking.id}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-xs">
                                    {booking.tutorProfile?.user?.name?.charAt(
                                      0,
                                    ) || "T"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">
                                    {booking.tutorProfile?.user?.name ||
                                      "Unknown"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {booking.subject?.name} • $
                                    {parseFloat(booking.booking_price).toFixed(
                                      2,
                                    )}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn("text-xs", status?.badge)}
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status?.label}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No recent activity
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Reviews */}
                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Recent Reviews
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/dashboard/student/reviews">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {recentReviews.length > 0 ? (
                      <div className="space-y-3">
                        {recentReviews.map((review: any) => (
                          <div
                            key={review.id}
                            className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-primary/10 text-xs">
                                    {review.tutorProfile?.user?.name?.charAt(
                                      0,
                                    ) || "T"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {review.tutorProfile?.user?.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={cn(
                                      "h-3 w-3",
                                      star <=
                                        Math.round(parseFloat(review.rating))
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground/30",
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-xs text-muted-foreground italic pl-8">
                                "{review.comment.substring(0, 60)}..."
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No reviews yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Upcoming Tab */}
            <TabsContent value="upcoming">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
                  <CardDescription>
                    Your scheduled learning sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingSessions.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingSessions.map((booking: any) => (
                        <div
                          key={booking.id}
                          className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary/10">
                                  {booking.tutorProfile?.user?.name?.charAt(
                                    0,
                                  ) || "T"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">
                                  {booking.tutorProfile?.user?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.subject?.name}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {booking.timeSlot?.date
                                      ? formatDate(booking.timeSlot.date)
                                      : "TBD"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {booking.timeSlot?.startTime
                                      ? `${formatTime(booking.timeSlot.startTime)} - ${formatTime(booking.timeSlot.endTime)}`
                                      : "TBD"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                Confirmed
                              </Badge>
                              <Button className="gap-2">
                                <Video className="h-4 w-4" />
                                Join Session
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">
                        No upcoming sessions
                      </p>
                      <Button asChild className="mt-4">
                        <Link href="/dashboard/student/tutors">
                          Find a Tutor
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* All Bookings Tab */}
            <TabsContent value="bookings">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">All Bookings</CardTitle>
                  <CardDescription>
                    Complete history of your learning sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {student.bookings?.length > 0 ? (
                    <div className="space-y-4">
                      {student.bookings.map((booking: any) => {
                        const status =
                          statusConfig[
                            booking.status as keyof typeof statusConfig
                          ];
                        const StatusIcon = status?.icon;
                        return (
                          <div
                            key={booking.id}
                            className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-primary/10">
                                    {booking.tutorProfile?.user?.name?.charAt(
                                      0,
                                    ) || "T"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">
                                    {booking.tutorProfile?.user?.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {booking.subject?.name}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                    <span>{formatDate(booking.createdAt)}</span>
                                    <span>•</span>
                                    <span>
                                      $
                                      {parseFloat(
                                        booking.booking_price,
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={cn("text-xs", status?.badge)}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {status?.label}
                                </Badge>
                                {booking.status === "CONFIRM" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                  >
                                    <Video className="h-3 w-3" />
                                    Join
                                  </Button>
                                )}
                              </div>
                            </div>
                            {booking.review && (
                              <div className="mt-3 pt-3 border-t border-border/50">
                                <div className="flex items-start gap-2">
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={cn(
                                          "h-3 w-3",
                                          star <=
                                            Math.round(
                                              parseFloat(booking.review.rating),
                                            )
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground/30",
                                        )}
                                      />
                                    ))}
                                  </div>
                                  <p className="text-xs text-muted-foreground italic">
                                    "{booking.review.comment || "No comment"}"
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No bookings yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">My Reviews</CardTitle>
                  <CardDescription>
                    Reviews you've left for tutors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {student.reviews?.length > 0 ? (
                    <div className="space-y-4">
                      {student.reviews.map((review: any) => (
                        <div
                          key={review.id}
                          className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10">
                                  {review.tutorProfile?.user?.name?.charAt(0) ||
                                    "T"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">
                                  {review.tutorProfile?.user?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(review.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn(
                                    "h-4 w-4",
                                    star <=
                                      Math.round(parseFloat(review.rating))
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground/30",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-muted-foreground italic pl-13">
                              "{review.comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Star className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No reviews yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
