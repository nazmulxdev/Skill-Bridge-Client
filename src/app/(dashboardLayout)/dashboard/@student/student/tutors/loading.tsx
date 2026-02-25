import { Loader2, BookOpen } from "lucide-react";

export default function TutorsLoading() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="h-8 w-64 bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-96 bg-muted rounded animate-pulse mt-2" />
            </div>
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-muted rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-muted rounded-lg animate-pulse hidden lg:block" />
            <div className="h-10 w-24 bg-muted rounded-lg animate-pulse lg:hidden" />
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="hidden lg:flex gap-4 items-end">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-10 w-[120px] bg-muted rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Tutors Grid Skeleton */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="border border-border/50 rounded-xl overflow-hidden bg-card/50"
              >
                {/* Header Gradient */}
                <div className="relative h-24 bg-gradient-to-r from-muted/50 via-muted/30 to-transparent">
                  {/* Avatar Skeleton */}
                  <div className="absolute -bottom-12 left-6">
                    <div className="h-24 w-24 rounded-full bg-muted animate-pulse ring-4 ring-background" />
                  </div>
                </div>

                {/* Content Skeleton */}
                <div className="pt-16 p-6 space-y-4">
                  {/* Name and Rating */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                      <div className="flex gap-2">
                        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                      <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                    </div>
                  </div>

                  {/* Subjects Skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    <div className="flex gap-1">
                      {[1, 2, 3].map((j) => (
                        <div
                          key={j}
                          className="h-6 w-16 bg-muted rounded-full animate-pulse"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Education Skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                      <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Availability Skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    <div className="flex gap-1">
                      {[1, 2, 3].map((j) => (
                        <div
                          key={j}
                          className="h-5 w-12 bg-muted rounded-full animate-pulse"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Button Skeleton */}
                  <div className="pt-4 border-t border-border/50">
                    <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="max-w-7xl mx-auto mt-12 flex justify-center items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
            <div className="relative h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
