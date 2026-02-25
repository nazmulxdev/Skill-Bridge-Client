import { Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function StudentReviewsLoading() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="h-8 w-40 bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-56 bg-muted rounded animate-pulse mt-2" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 bg-muted rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-muted rounded-full animate-pulse" />
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-6 w-12 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Rating Distribution Skeleton */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="h-5 w-36 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                    <div className="flex-1 h-2 bg-muted rounded-full animate-pulse" />
                    <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews List Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Tutor Info Skeleton */}
                    <div className="flex items-start gap-4 md:w-64">
                      <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                      </div>
                    </div>

                    {/* Review Details Skeleton */}
                    <div className="flex-1 space-y-3">
                      {/* Header with Rating and Date */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <div
                                key={s}
                                className="h-4 w-4 bg-muted rounded animate-pulse"
                              />
                            ))}
                          </div>
                          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                      </div>

                      {/* Comment Skeleton */}
                      <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <div className="h-3 w-full bg-muted rounded animate-pulse" />
                        <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
                      </div>

                      {/* Session Details Skeleton */}
                      <div className="flex items-center gap-4 pt-2">
                        <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-3 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                      </div>

                      {/* Helpful Button Skeleton */}
                      <div className="flex items-center gap-4 pt-2">
                        <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
                        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tips Card Skeleton */}
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded bg-muted animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-full bg-muted rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Centered Loading Indicator */}
          <div className="flex justify-center items-center py-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
              <div className="relative w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
