"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock as PendingIcon,
  AlertCircle,
  Filter,
  Star,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { confirmStudentBookedSlot } from "@/actions/tutor.action";

interface TutorBookingsProps {
  bookings: any[];
}

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

// Helper to format error message
const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";
  if (typeof error === "object" && error !== null) {
    if (error.message) return error.message;
    if (error.error?.message) return error.error.message;
    return "Operation failed. Please try again.";
  }
  if (typeof error === "string") {
    if (error.includes("[object Object]")) {
      return "Operation failed. Please try again.";
    }
    return error;
  }
  return "Something went wrong. Please try again.";
};

export function TutorBookings({ bookings }: TutorBookingsProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleConfirmBooking = async (bookingId: string) => {
    setConfirmingId(bookingId);
    const toastId = toast.loading("Confirming booking...");
    try {
      const { data, error } = await confirmStudentBookedSlot(bookingId);

      if (!data || error) {
        throw new Error(error?.message || "Failed to confirm booking");
      }
      toast.success("Booking confirmed successfully!", { id: toastId });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setConfirmingId(null);
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
          <p className="text-muted-foreground">
            When students book your sessions, they will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats
  const stats = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRM").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    completed: bookings.filter((b) => b.status === "COMPLETE").length,
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.status === filterStatus;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "price-high") {
      return parseFloat(b.booking_price) - parseFloat(a.booking_price);
    }
    if (sortBy === "price-low") {
      return parseFloat(a.booking_price) - parseFloat(b.booking_price);
    }
    return 0;
  });

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.all}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 border-yellow-500/20">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 border-green-500/20">
          <CardContent className="p-4">
            <p className="text-sm text-green-600">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.confirmed}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 border-blue-500/20">
          <CardContent className="p-4">
            <p className="text-sm text-blue-600">Completed</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.completed}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 border-red-500/20">
          <CardContent className="p-4">
            <p className="text-sm text-red-600">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Tabs
          defaultValue="all"
          className="w-full sm:w-auto"
          onValueChange={setFilterStatus}
        >
          <TabsList className="grid grid-cols-5 w-full sm:w-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All ({stats.all})
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="text-xs sm:text-sm">
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="CONFIRM" className="text-xs sm:text-sm">
              Confirmed ({stats.confirmed})
            </TabsTrigger>
            <TabsTrigger value="COMPLETE" className="text-xs sm:text-sm">
              Completed ({stats.completed})
            </TabsTrigger>
            <TabsTrigger value="CANCELLED" className="text-xs sm:text-sm">
              Cancelled ({stats.cancelled})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {sortedBookings.map((booking) => {
          const status =
            statusConfig[booking.status as keyof typeof statusConfig];
          const StatusIcon = status?.icon || AlertCircle;
          const isConfirming = confirmingId === booking.id;

          return (
            <Card
              key={booking.id}
              className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Section - Student Info */}
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10">
                        {booking.student?.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">
                          {booking.student?.name || "Unknown Student"}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", status?.badge)}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status?.label || booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.student?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* Middle Section - Booking Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 lg:ml-6">
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Date
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(booking.timeSlot?.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Time
                      </p>
                      <p className="text-sm font-medium">
                        {booking.timeSlot?.startTime} -{" "}
                        {booking.timeSlot?.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> Subject
                      </p>
                      <p className="text-sm font-medium">
                        {booking.subject?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> Price
                      </p>
                      <p className="text-sm font-bold text-primary">
                        ${booking.booking_price}
                      </p>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex gap-2 lg:ml-4">
                    {booking.status === "PENDING" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 min-w-[80px]"
                        onClick={() => handleConfirmBooking(booking.id)}
                        disabled={isConfirming}
                      >
                        {isConfirming ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            ...
                          </>
                        ) : (
                          "Confirm"
                        )}
                      </Button>
                    )}
                    {booking.status === "CONFIRM" && (
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600 border-green-500/20"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Confirmed
                      </Badge>
                    )}
                    {booking.status === "COMPLETE" && !booking.review && (
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Awaiting Review
                      </Badge>
                    )}
                    {booking.review && (
                      <Badge
                        variant="outline"
                        className="bg-purple-500/10 text-purple-600"
                      >
                        <Star className="h-3 w-3 mr-1 fill-purple-600" />
                        Reviewed
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Review Section (if exists) */}
                {booking.review && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-start gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-3 w-3",
                              star <=
                                Math.round(parseFloat(booking.review.rating))
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30",
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{booking.review.comment || "No comment provided"}"
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {sortedBookings.length === 0 && (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                No bookings found for this filter.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
