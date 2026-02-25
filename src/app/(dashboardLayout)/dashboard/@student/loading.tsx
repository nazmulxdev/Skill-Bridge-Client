import { GraduationCap, BookOpen, Clock, Star } from "lucide-react";

export default function StudentDashboardLoading() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header Skeleton */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="h-8 w-64 bg-muted rounded-lg animate-pulse" />
                <div className="h-4 w-96 bg-muted rounded animate-pulse mt-2" />
              </div>
              <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card/50 border border-border/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-12 w-12 bg-muted rounded-xl animate-pulse" />
                </div>
                <div className="mt-4">
                  <div className="h-3 w-24 bg-muted/50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Sessions - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground/50" />
                      <div className="h-6 w-40 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
                  </div>
                  <div className="h-4 w-48 bg-muted rounded animate-pulse mt-2" />
                </div>

                {/* Session Items */}
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/5 border border-border/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-24 bg-muted/50 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-16 bg-muted rounded animate-pulse ml-auto" />
                        <div className="h-7 w-20 bg-muted rounded-lg animate-pulse ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Progress - Takes 1 column */}
            <div className="lg:col-span-1">
              <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground/50" />
                    <div className="h-6 w-40 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse mt-2" />
                </div>

                {/* Progress Content */}
                <div className="p-6 space-y-6">
                  {/* Weekly Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-muted/50 rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Subjects Progress */}
                  <div className="space-y-4">
                    <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-muted/50 rounded-full animate-pulse"
                            style={{ width: `${Math.random() * 70 + 20}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Button Skeleton */}
                  <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Tutors Section Skeleton */}
          <div className="mt-8">
            <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-muted-foreground/50" />
                    <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
                </div>
                <div className="h-4 w-56 bg-muted rounded animate-pulse mt-2" />
              </div>

              {/* Tutors Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="p-4 rounded-xl border border-border/50 bg-muted/5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                          </div>
                        </div>
                        <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                      </div>

                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                          <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                      </div>

                      <div className="mt-3 flex gap-1">
                        {[1, 2, 3].map((k) => (
                          <div
                            key={k}
                            className="h-5 w-16 bg-muted rounded-full animate-pulse"
                          />
                        ))}
                      </div>

                      <div className="mt-4 h-8 w-full bg-muted rounded-lg animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="mt-12 flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
              <div className="relative h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
