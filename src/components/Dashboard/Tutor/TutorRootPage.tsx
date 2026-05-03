"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  Users,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  GraduationCap,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
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

interface TutorRootDashboardProps {
  userData: any;
  tutorProfile: any;
}

export function TutorRootPage({
  userData,
  tutorProfile,
}: TutorRootDashboardProps) {
  const router = useRouter();
  const { name, email, image } = userData;

  // Calculate profile completion
  const steps = {
    hourlyRate: tutorProfile?.hourlyRate != null,
    education: (tutorProfile?.education?.length || 0) > 0,
    subjects: (tutorProfile?.subjects?.length || 0) > 0,
    availability: (tutorProfile?.availabilities?.length || 0) > 0,
    timeSlots: (tutorProfile?.tutorTimeSlots?.length || 0) > 0,
  };

  const completedSteps = Object.values(steps).filter(Boolean).length;
  const totalSteps = 5;
  const completionPercentage = (completedSteps / totalSteps) * 100;
  const isProfileComplete = completedSteps === totalSteps;

  // Calculate stats from data
  const totalSessions = tutorProfile?.bookings?.length || 0;
  const completedSessions =
    tutorProfile?.bookings?.filter((b: any) => b.status === "COMPLETE")
      .length || 0;
  const pendingSessions =
    tutorProfile?.bookings?.filter((b: any) => b.status === "PENDING").length ||
    0;
  const confirmedSessions =
    tutorProfile?.bookings?.filter((b: any) => b.status === "CONFIRM").length ||
    0;
  const cancelledSessions =
    tutorProfile?.bookings?.filter((b: any) => b.status === "CANCELLED")
      .length || 0;

  const totalReviews = tutorProfile?.reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? (
          tutorProfile.reviews.reduce(
            (acc: number, r: any) => acc + parseFloat(r.rating),
            0,
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  const totalEarnings =
    tutorProfile?.bookings
      ?.filter((b: any) => b.status === "COMPLETE")
      .reduce((acc: number, b: any) => acc + parseFloat(b.booking_price), 0) ||
    0;

  const upcomingSlots =
    tutorProfile?.tutorTimeSlots?.filter(
      (s: any) => !s.isBooked && new Date(s.date) > new Date(),
    ).length || 0;

  const totalStudents =
    new Set(tutorProfile?.bookings?.map((b: any) => b.studentId)).size || 0;

  // Chart data for booking status distribution
  const CHART_COLORS = {
    warning: "hsl(45 93% 47%)",
    primary: "hsl(var(--primary))",
    success: "hsl(142 71% 45%)",
    destructive: "hsl(0 84% 60%)",
  };

  const bookingStatusData = [
    { name: "Pending", value: pendingSessions, fill: CHART_COLORS.warning },
    { name: "Confirmed", value: confirmedSessions, fill: CHART_COLORS.primary },
    { name: "Completed", value: completedSessions, fill: CHART_COLORS.success },
    {
      name: "Cancelled",
      value: cancelledSessions,
      fill: CHART_COLORS.destructive,
    },
  ];

  // Get recent bookings
  const recentBookings =
    tutorProfile?.bookings
      ?.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5) || [];

  // Status badge color mapping
  const statusConfig: Record<string, { color: string; icon: any }> = {
    PENDING: {
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      icon: Clock,
    },
    CONFIRM: {
      color: "bg-green-500/10 text-green-600 border-green-500/20",
      icon: CheckCircle2,
    },
    COMPLETE: {
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: CheckCircle2,
    },
    CANCELLED: {
      color: "bg-red-500/10 text-red-600 border-red-500/20",
      icon: XCircle,
    },
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={image || ""} />
            <AvatarFallback className="text-xl bg-primary/10">
              {name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {name}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your teaching journey.
            </p>
          </div>
        </div>

        {!isProfileComplete && (
          <Link href="/dashboard/tutor/profile">
            <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
              Complete Profile Setup
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Profile Completion Alert (if incomplete) */}
      {!isProfileComplete && (
        <Alert className="border-primary/20 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">
            Complete Your Profile
          </AlertTitle>
          <AlertDescription>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Profile Completion</span>
                  <span className="font-medium">
                    {Math.round(completionPercentage)}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              <Link href="/dashboard/tutor/profile">
                <Button
                  size="sm"
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  Continue Setup
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold mt-1">{totalSessions}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-yellow-600">{pendingSessions} pending</span>
              <span className="text-green-600">
                {confirmedSessions} confirmed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-bold mt-1">{totalStudents}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Unique students
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Earnings</p>
                <p className="text-2xl font-bold mt-1">${totalEarnings}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-success mt-2">+12% this month</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold mt-1">{averageRating}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Star className="h-5 w-5 text-primary fill-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {totalReviews} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-yellow-500/5 to-transparent">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                {pendingSessions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-green-500/5 to-transparent">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-xl font-bold text-green-600">
                {confirmedSessions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-xl font-bold text-blue-600">
                {completedSessions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <CalendarDays className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Slots</p>
              <p className="text-xl font-bold text-purple-600">
                {upcomingSlots}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Status Chart */}
      {totalSessions > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Your Booking Status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribution of your sessions by status
            </p>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bookingStatusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Bookings
            </CardTitle>
            <Link href="/dashboard/tutor/bookings">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-3">
                {recentBookings.map((booking: any) => {
                  const StatusIcon =
                    statusConfig[booking.status]?.icon || Clock;
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10">
                            {booking.student?.name?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {booking.student?.name || "Unknown Student"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.subject?.name} • ${booking.booking_price}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            statusConfig[booking.status]?.color,
                          )}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {booking.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            booking.timeSlot?.date,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No bookings yet</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  When students book your sessions, they'll appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/tutor/timeSlots">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <CalendarDays className="h-4 w-4" />
                  Create Time Slots
                </Button>
              </Link>
              <Link href="/dashboard/tutor/availability">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Manage Availability
                </Button>
              </Link>
              <Link href="/dashboard/tutor/subjects">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Update Subjects
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Slots Card */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Upcoming Available Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingSlots > 0 ? (
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">
                    {upcomingSlots}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    slots available for booking
                  </p>
                  <Link href="/dashboard/tutor/timeSlots">
                    <Button size="sm" variant="link" className="px-0">
                      Manage slots <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No upcoming slots
                  </p>
                  <Link href="/dashboard/tutor/timeSlots">
                    <Button size="sm" variant="link" className="mt-2">
                      Create your first slot
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Completion Card */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-medium">
                    {Math.round(completionPercentage)}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />

                <div className="space-y-2 mt-4">
                  {Object.entries(steps).map(([key, completed]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      {completed ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground/30" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
