// src/components/Dashboard/Student/DashboardStudentReviewsClient.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Star,
  MessageSquare,
  Calendar,
  User,
  BookOpen,
  DollarSign,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StudentReviewsClientProps {
  student: any;
}

// Helper to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
};

// Rating distribution bar
const RatingBar = ({
  stars,
  count,
  total,
}: {
  stars: number;
  count: number;
  total: number;
}) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm w-12">{stars} stars</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground w-12">{count}</span>
    </div>
  );
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export function DashboardStudentReviewsClient({
  student,
}: StudentReviewsClientProps) {
  const reviews = student?.reviews || [];
  const totalReviews = reviews.length;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate rating statistics
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (acc: number, r: any) => acc + parseFloat(r.rating),
            0,
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  const ratingCounts = {
    5: reviews.filter((r: any) => Math.round(parseFloat(r.rating)) === 5)
      .length,
    4: reviews.filter((r: any) => Math.round(parseFloat(r.rating)) === 4)
      .length,
    3: reviews.filter((r: any) => Math.round(parseFloat(r.rating)) === 3)
      .length,
    2: reviews.filter((r: any) => Math.round(parseFloat(r.rating)) === 2)
      .length,
    1: reviews.filter((r: any) => Math.round(parseFloat(r.rating)) === 1)
      .length,
  };

  // Get unique tutors from reviews
  const uniqueTutors = [
    ...new Set(reviews.map((r: any) => r.tutorProfile?.user?.id)),
  ].length;

  // Pagination calculations
  const totalItems = totalReviews;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReviews = reviews.slice(startIndex, endIndex);

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
          {totalItems} reviews
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
        <div className=" mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Reviews</h1>
              <p className="text-muted-foreground mt-2">
                See all the reviews you've left for tutors
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Total: {totalReviews}
              </Badge>
              <Badge
                variant="outline"
                className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 px-3 py-1"
              >
                <Star className="h-3.5 w-3.5 mr-1 fill-yellow-500" />
                {averageRating} avg
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Average Rating
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {averageRating}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-yellow-500/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-yellow-500/10">
                    <MessageSquare className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Reviews
                    </p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {totalReviews}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-green-500/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-500/10">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tutors Reviewed
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {uniqueTutors}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rating Summary */}
          {totalReviews > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <RatingBar
                      key={stars}
                      stars={stars}
                      count={ratingCounts[stars as keyof typeof ratingCounts]}
                      total={totalReviews}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          {totalReviews > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedReviews.map((review: any, index: number) => (
                  <Card
                    key={review.id}
                    className="border-border/50 hover:shadow-md transition-all"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Tutor Info */}
                        <div className="flex items-start gap-4 md:w-64">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={review.tutorProfile?.user?.image || ""}
                            />
                            <AvatarFallback className="bg-primary/10">
                              {review.tutorProfile?.user?.name?.charAt(0) ||
                                "T"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">
                              {review.tutorProfile?.user?.name ||
                                "Unknown Tutor"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Tutor
                            </p>
                            <Link
                              href={`/dashboard/student/tutors/${review.tutorProfile?.id}`}
                              className="text-xs text-primary hover:underline mt-1 inline-block"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>

                        {/* Review Details */}
                        <div className="flex-1 space-y-3">
                          {/* Header with Rating and Date */}
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <StarRating
                                  rating={Math.round(parseFloat(review.rating))}
                                />
                                <span className="text-sm font-medium">
                                  {parseFloat(review.rating).toFixed(1)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(review.createdAt)}</span>
                              </div>
                            </div>

                            {/* Booking Info */}
                            {review.booking && (
                              <Badge variant="outline" className="bg-primary/5">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {review.booking.subject?.name || "Session"}
                              </Badge>
                            )}
                          </div>

                          {/* Review Comment */}
                          {review.comment ? (
                            <div className="bg-muted/30 p-4 rounded-lg">
                              <p className="text-muted-foreground italic">
                                "{review.comment}"
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              No comment provided
                            </p>
                          )}

                          {/* Session Details */}
                          {review.booking && (
                            <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3 mt-2">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />$
                                {parseFloat(
                                  review.booking.booking_price,
                                ).toFixed(2)}
                              </span>
                              {review.booking.timeSlot && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {review.booking.timeSlot.startTime} -{" "}
                                    {review.booking.timeSlot.endTime}
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <Pagination />
            </>
          ) : (
            <Card className="border-border/50">
              <CardContent className="p-16 text-center">
                <div className="max-w-md mx-auto">
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't left any reviews yet. After completing sessions
                    with tutors, you can share your experience!
                  </p>
                  <Button asChild>
                    <Link href="/tutors">Find Tutors to Review</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips Card */}
          {totalReviews > 0 && (
            <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Why Reviews Matter</p>
                    <p className="text-xs text-muted-foreground">
                      Your honest reviews help other students find the right
                      tutors and help tutors improve their teaching. Thank you
                      for contributing to the community!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
