"use client";

import { useState } from "react";
import {
  Star,
  MessageSquare,
  Calendar,
  ThumbsUp,
  Filter,
  Award,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TutorReviewsPageProps {
  tutorProfile: any;
}

// Helper to format date without date-fns
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
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: stars * 0.1 }}
          className="h-full bg-yellow-400 rounded-full"
        />
      </div>
      <span className="text-sm text-muted-foreground w-12">{count}</span>
    </div>
  );
};

export function TutorCompleteReviews({ tutorProfile }: TutorReviewsPageProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");

  const reviews = tutorProfile?.reviews || [];
  const totalReviews = reviews.length;

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

  // Sort and filter reviews
  const filteredReviews = reviews
    .filter((review: any) => {
      if (filterRating === "all") return true;
      return Math.round(parseFloat(review.rating)) === parseInt(filterRating);
    })
    .sort((a: any, b: any) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortBy === "highest") {
        return parseFloat(b.rating) - parseFloat(a.rating);
      }
      if (sortBy === "lowest") {
        return parseFloat(a.rating) - parseFloat(b.rating);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header with Back Button and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Student Reviews</h1>
            <p className="text-muted-foreground">
              See what students are saying about your teaching
            </p>
          </div>
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

      {/* Main Card */}
      <Card className="border-border/50 bg-gradient-to-br from-card/50 to-background overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-transparent pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 ring-2 ring-primary/20">
              <Star className="h-5 w-5 text-primary fill-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Reviews & Ratings</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-0.5">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Feedback from your students</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {totalReviews > 0 ? (
            <>
              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-xl border border-yellow-500/10">
                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-5xl font-bold text-yellow-600">
                    {averageRating}
                  </div>
                  <StarRating rating={Math.round(parseFloat(averageRating))} />
                  <p className="text-sm text-muted-foreground mt-2">
                    {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="md:col-span-2 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <RatingBar
                      key={stars}
                      stars={stars}
                      count={ratingCounts[stars as keyof typeof ratingCounts]}
                      total={totalReviews}
                    />
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filter:</span>
                  <Tabs
                    defaultValue="all"
                    value={filterRating}
                    onValueChange={setFilterRating}
                  >
                    <TabsList className="grid grid-cols-6 h-9">
                      <TabsTrigger value="all" className="text-xs px-3">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="5" className="text-xs px-3">
                        5★
                      </TabsTrigger>
                      <TabsTrigger value="4" className="text-xs px-3">
                        4★
                      </TabsTrigger>
                      <TabsTrigger value="3" className="text-xs px-3">
                        3★
                      </TabsTrigger>
                      <TabsTrigger value="2" className="text-xs px-3">
                        2★
                      </TabsTrigger>
                      <TabsTrigger value="1" className="text-xs px-3">
                        1★
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Rating</SelectItem>
                    <SelectItem value="lowest">Lowest Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reviews List */}
              <AnimatePresence mode="popLayout">
                <div className="space-y-4">
                  {filteredReviews.map((review: any, index: number) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative p-6 rounded-xl border border-border/50 hover:border-primary/30 bg-gradient-to-r from-muted/30 to-transparent transition-all duration-300 hover:shadow-md"
                    >
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                            <AvatarFallback className="bg-primary/10">
                              {review.student?.name?.charAt(0) || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {review.student?.name || "Anonymous Student"}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs bg-primary/5"
                              >
                                Student
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(review.createdAt)}
                              </span>
                              {review.booking?.subject && (
                                <span className="flex items-center gap-1">
                                  <span>•</span>
                                  {review.booking.subject.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StarRating
                            rating={Math.round(parseFloat(review.rating))}
                          />
                          <span className="text-sm font-medium ml-1">
                            {parseFloat(review.rating).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Review Comment */}
                      {review.comment && (
                        <div className="pl-13">
                          <p className="text-muted-foreground italic border-l-2 border-primary/20 pl-4 py-1">
                            "{review.comment}"
                          </p>
                        </div>
                      )}

                      {/* Review Footer */}
                      <div className="flex items-center gap-4 mt-4 pt-2 border-t border-border/40">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-muted-foreground hover:text-primary"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          Helpful
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {review.helpful?.length || 0} found this helpful
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {filteredReviews.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-border/50 rounded-xl bg-muted/10"
                >
                  <Filter className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    No reviews match your filter
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setFilterRating("all")}
                    className="mt-2"
                  >
                    Clear filter
                  </Button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border/50 rounded-xl bg-muted/10"
            >
              <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium text-lg">
                No reviews yet
              </p>
              <p className="text-sm text-muted-foreground/60 mt-2 text-center max-w-md">
                When students complete sessions with you, they can leave
                reviews. Check back later!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">0</div>
                  <p className="text-xs text-muted-foreground">Total Reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">0.0</div>
                  <p className="text-xs text-muted-foreground">
                    Average Rating
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">0</div>
                  <p className="text-xs text-muted-foreground">
                    5-Star Reviews
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Build Trust</p>
                <p className="text-xs text-muted-foreground">
                  Positive reviews help build trust with potential students and
                  increase bookings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-emerald-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Improve Teaching</p>
                <p className="text-xs text-muted-foreground">
                  Use feedback to understand what students appreciate and where
                  you can improve.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Recent Reviews</p>
                <p className="text-xs text-muted-foreground">
                  Latest reviews appear first. You can sort by rating or date to
                  find specific feedback.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
