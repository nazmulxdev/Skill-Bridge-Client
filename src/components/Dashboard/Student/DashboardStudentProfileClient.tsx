"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Star,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock as PendingIcon,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
interface StudentProfileClientProps {
  student: any;
}

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
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

export function DashboardStudentProfileClient({
  student,
}: StudentProfileClientProps) {
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

  // Get recent bookings
  const recentBookings =
    student.bookings
      ?.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5) || [];

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className=" mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarImage src={student.image || ""} />
                    <AvatarFallback className="text-3xl bg-primary/10">
                      {student.name?.charAt(0) || "S"}
                    </AvatarFallback>
                  </Avatar>
                  {student.status === "UNBANNED" ? (
                    <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-background" />
                  ) : (
                    <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-red-500 ring-2 ring-background" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold">{student.name}</h1>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary"
                    >
                      Student
                    </Badge>
                    {student.status === "BANNED" && (
                      <Badge variant="destructive">Banned</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{student.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(student.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap mt-2">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      {totalBookings} Sessions
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-yellow-500/10 text-yellow-600"
                    >
                      <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                      {averageRating} Avg Rating
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-600"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />${totalSpent} Spent
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{totalBookings}</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 border-yellow-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingBookings}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 border-green-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-green-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {confirmedBookings}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 border-blue-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-blue-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {completedBookings}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 border-red-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-red-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {cancelledBookings}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Unique Tutors
                        </p>
                        <p className="text-3xl font-bold">{uniqueTutors}</p>
                      </div>
                      <div className="p-3 rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-gradient-to-br from-yellow-500/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Reviews Left
                        </p>
                        <p className="text-3xl font-bold">{totalReviews}</p>
                      </div>
                      <div className="p-3 rounded-full bg-yellow-500/10">
                        <MessageSquare className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-gradient-to-br from-green-500/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Spent
                        </p>
                        <p className="text-3xl font-bold">${totalSpent}</p>
                      </div>
                      <div className="p-3 rounded-full bg-green-500/10">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Bookings */}
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Bookings</CardTitle>
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
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10">
                                  {booking.tutorProfile?.user?.name?.charAt(
                                    0,
                                  ) || "T"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {booking.tutorProfile?.user?.name ||
                                    "Unknown Tutor"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {booking.subject?.name} • $
                                  {parseFloat(booking.booking_price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="outline"
                                className={cn("text-xs", status?.badge)}
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status?.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(booking.timeSlot?.date)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No bookings yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              {student.reviews?.length > 0 && (
                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Recent Reviews</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/dashboard/student/reviews">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {student.reviews.slice(0, 3).map((review: any) => (
                        <div
                          key={review.id}
                          className="p-3 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-primary/10 text-xs">
                                  {review.tutorProfile?.user?.name?.charAt(0) ||
                                    "T"}
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
                            <p className="text-sm text-muted-foreground italic pl-8">
                              "{review.comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {student.bookings?.length > 0 ? (
                    <div className="space-y-3">
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
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Date
                                  </p>
                                  <p className="text-sm">
                                    {booking.timeSlot?.date
                                      ? formatDate(booking.timeSlot.date)
                                      : "TBD"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Time
                                  </p>
                                  <p className="text-sm">
                                    {booking.timeSlot?.startTime &&
                                    booking.timeSlot?.endTime
                                      ? `${formatTime(booking.timeSlot.startTime)} - ${formatTime(booking.timeSlot.endTime)}`
                                      : "TBD"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Price
                                  </p>
                                  <p className="text-sm font-bold text-primary">
                                    $
                                    {parseFloat(booking.booking_price).toFixed(
                                      2,
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Status
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className={cn("text-xs", status?.badge)}
                                  >
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {status?.label}
                                  </Badge>
                                </div>
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
                                  <p className="text-sm text-muted-foreground italic">
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
                      <p className="text-muted-foreground">No bookings found</p>
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
                </CardHeader>
                <CardContent>
                  {student.reviews?.length > 0 ? (
                    <div className="space-y-4">
                      {student.reviews.map((review: any) => (
                        <div
                          key={review.id}
                          className="p-4 rounded-lg border border-border/50"
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
                          {review.booking && (
                            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {review.booking.subject?.name}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No reviews yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Learning Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Booking Status Distribution */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Booking Status</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completed</span>
                          <span className="font-medium">
                            {completedBookings}
                          </span>
                        </div>
                        <Progress
                          value={(completedBookings / totalBookings) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Confirmed</span>
                          <span className="font-medium">
                            {confirmedBookings}
                          </span>
                        </div>
                        <Progress
                          value={(confirmedBookings / totalBookings) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Pending</span>
                          <span className="font-medium">{pendingBookings}</span>
                        </div>
                        <Progress
                          value={(pendingBookings / totalBookings) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Cancelled</span>
                          <span className="font-medium">
                            {cancelledBookings}
                          </span>
                        </div>
                        <Progress
                          value={(cancelledBookings / totalBookings) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating Distribution */}
                  {totalReviews > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        Rating Distribution
                      </h3>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = student.reviews.filter(
                            (r: any) =>
                              Math.round(parseFloat(r.rating)) === stars,
                          ).length;
                          const percentage = (count / totalReviews) * 100;
                          return (
                            <div
                              key={stars}
                              className="flex items-center gap-2"
                            >
                              <span className="text-sm w-12">
                                {stars} stars
                              </span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-8">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">
                        {uniqueTutors}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Unique Tutors
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">
                        ${totalSpent}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Spent
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
