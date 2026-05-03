// src/components/Dashboard/Student/DashboardBookingClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Video,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cancelBooking, makeSessionReview } from "@/actions/atudent.action";

interface StudentBookingsClientProps {
  student: any;
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: PendingIcon,
    color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
    badge: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    description: "Waiting for tutor confirmation",
    actions: ["cancel"],
  },
  CONFIRM: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "text-green-600 bg-green-500/10 border-green-500/20",
    badge: "bg-green-500/10 text-green-600 border-green-500/20",
    description: "Session confirmed! Click Join to start",
    actions: ["join", "cancel"],
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600 bg-red-500/10 border-red-500/20",
    badge: "bg-red-500/10 text-red-600 border-red-500/20",
    description: "This booking was cancelled",
    actions: [],
  },
  COMPLETE: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    description: "Session completed",
    actions: [],
  },
};

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
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

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export function DashboardBookingClient({
  student,
}: StudentBookingsClientProps) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const bookings = student?.bookings || [];

  if (!bookings || bookings.length === 0) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-5xl mx-auto text-center py-16">
            <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h1 className="text-2xl font-bold mb-2">No Bookings Yet</h1>
            <p className="text-muted-foreground mb-6">
              You haven't booked any sessions yet. Browse tutors to get started!
            </p>
            <Button asChild>
              <Link href="/tutors">Find Tutors</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    all: bookings.length,
    pending: bookings.filter((b: any) => b.status === "PENDING").length,
    confirmed: bookings.filter((b: any) => b.status === "CONFIRM").length,
    cancelled: bookings.filter((b: any) => b.status === "CANCELLED").length,
    completed: bookings.filter((b: any) => b.status === "COMPLETE").length,
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking: any) => {
    if (filterStatus === "all") return true;
    return booking.status === filterStatus;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a: any, b: any) => {
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
    if (sortBy === "upcoming") {
      const aDate = a.timeSlot?.date ? new Date(a.timeSlot.date).getTime() : 0;
      const bDate = b.timeSlot?.date ? new Date(b.timeSlot.date).getTime() : 0;
      return aDate - bDate;
    }
    return 0;
  });

  // Pagination calculations
  const totalItems = sortedBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = sortedBookings.slice(startIndex, endIndex);

  // Reset to page 1 when filter or sort changes
  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    const toastId = toast.loading("Cancelling booking...");

    try {
      const { data, error } = await cancelBooking(bookingId);

      if (error || !data) {
        throw new Error(getErrorMessage(error));
      }

      toast.success("Booking cancelled successfully!", { id: toastId });
      router.refresh();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setCancellingId(null);
    }
  };

  const handleJoinSession = (booking: any) => {
    router.push(`/dashboard/student/bookings/${booking.id}`);
    toast.success("Joining session...");
  };

  const handleOpenReview = (booking: any) => {
    setSelectedBooking(booking);
    setRating(0);
    setComment("");
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingReview(true);
    const toastId = toast.loading("Submitting review...");

    try {
      const { data, error } = await makeSessionReview({
        bookingId: selectedBooking.id,
        rating,
        comment,
      });

      if (error || !data) {
        throw new Error(getErrorMessage(error));
      }

      toast.success("Review submitted successfully!", { id: toastId });
      setReviewDialogOpen(false);
      setSelectedBooking(null);
      router.refresh();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Pagination Component
  const Pagination = () => {
    if (totalItems === 0) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
          {totalItems} bookings
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (page >= currentPage - 1 && page <= currentPage + 1)
                  return true;
                return false;
              })
              .map((page, index, array) => {
                if (index > 0 && page - array[index - 1] > 1) {
                  return (
                    <div
                      key={`ellipsis-${page}`}
                      className="flex items-center gap-1"
                    >
                      <span className="text-muted-foreground px-1">...</span>
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </div>
                  );
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your tutoring sessions and reviews
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
                <p className="text-2xl font-bold text-red-600">
                  {stats.cancelled}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
            <Tabs
              defaultValue="all"
              className="w-full sm:w-auto"
              onValueChange={handleFilterChange}
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

            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="upcoming">Upcoming First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {paginatedBookings.map((booking: any) => {
              const status =
                statusConfig[booking.status as keyof typeof statusConfig];
              const StatusIcon = status?.icon || AlertCircle;
              const isCancelling = cancellingId === booking.id;
              const canCancel =
                booking.status === "PENDING" || booking.status === "CONFIRM";
              const canJoin = booking.status === "CONFIRM";
              const canReview =
                booking.status === "COMPLETE" && !booking.review;

              return (
                <Card
                  key={booking.id}
                  className="border-border/50 bg-card/50 hover:shadow-md transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Section - Tutor Info */}
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={booking.tutorProfile?.user?.image || ""}
                          />
                          <AvatarFallback className="bg-primary/10">
                            {booking.tutorProfile?.user?.name?.charAt(0) || "T"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">
                              {booking.tutorProfile?.user?.name ||
                                "Unknown Tutor"}
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
                            {booking.subject?.name || "No subject"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {status?.description}
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
                            {booking.timeSlot?.date
                              ? formatDate(booking.timeSlot.date)
                              : "TBD"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Time
                          </p>
                          <p className="text-sm font-medium">
                            {booking.timeSlot?.startTime &&
                            booking.timeSlot?.endTime
                              ? `${formatTime(booking.timeSlot.startTime)} - ${formatTime(
                                  booking.timeSlot.endTime,
                                )}`
                              : "TBD"}
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
                            ${parseFloat(booking.booking_price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex gap-2 lg:ml-4">
                        {canJoin && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 gap-2"
                            onClick={() => handleJoinSession(booking)}
                          >
                            <Video className="h-4 w-4" />
                            Join Session
                          </Button>
                        )}

                        {canReview && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleOpenReview(booking)}
                          >
                            <Star className="h-4 w-4" />
                            Leave Review
                          </Button>
                        )}

                        {canCancel && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="gap-2"
                                disabled={isCancelling}
                              >
                                {isCancelling ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Cancel Booking
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this booking?
                                  {booking.status === "CONFIRM"
                                    ? " This session has been confirmed by the tutor."
                                    : ""}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  No, Keep It
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleCancelBooking(booking.id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Yes, Cancel Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {booking.review && (
                          <Badge
                            variant="outline"
                            className="bg-purple-500/10 text-purple-600 border-purple-500/20 gap-1"
                          >
                            <Star className="h-3 w-3 fill-purple-600" />
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
                                    Math.round(
                                      parseFloat(booking.review.rating),
                                    )
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground/30",
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground italic flex-1">
                            "{booking.review.comment || "No comment provided"}"
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {paginatedBookings.length === 0 && (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-12 text-center">
                  <Filter className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">
                    No bookings found for this filter.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          <Pagination />
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this tutor to help other students.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "p-0 h-8 w-8",
                      rating >= star
                        ? "text-yellow-400"
                        : "text-muted-foreground",
                    )}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        rating >= star ? "fill-yellow-400" : "",
                      )}
                    />
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={rating === 0 || submittingReview}
            >
              {submittingReview ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
