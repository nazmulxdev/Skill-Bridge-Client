import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingsLoading() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-9 w-16 bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
            <div className="h-9 w-[180px] bg-muted rounded-lg animate-pulse" />
          </div>

          {/* Bookings List Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                      </div>
                    </div>

                    {/* Middle Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="space-y-2">
                          <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                        </div>
                      ))}
                    </div>

                    {/* Right Section */}
                    <div className="flex gap-2">
                      <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
                      <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading Indicator */}
          <div className="mt-12 flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
              <div className="relative h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
