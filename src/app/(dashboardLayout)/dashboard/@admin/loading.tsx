// app/(dashboardLayout)/dashboard/admin/stats/loading.tsx
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminStatsLoading() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-72 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-9 w-32 bg-muted rounded animate-pulse" />
          </div>

          {/* Key Metrics Overview Skeletons */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-l-4 border-l-muted">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Platform Health Metrics Skeletons */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-6 w-12 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-8 bg-muted/50 rounded-full animate-pulse" />
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="h-3 w-3 bg-muted rounded-full animate-pulse" />
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Breakdown Skeletons */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 w-28 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="h-8 w-24 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Users Table Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              {/* Desktop Table Skeleton */}
              <div className="hidden md:block rounded-md border">
                <div className="p-4 border-b">
                  <div className="grid grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-4 w-20 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-5 gap-4">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                      <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Card Skeletons */}
              <div className="md:hidden space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-2">
                          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Tutors Skeletons */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                <div className="h-5 w-40 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-4 w-56 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-2">
                          <div className="h-5 w-28 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-36 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 p-2 rounded-lg">
                          <div className="h-3 w-16 bg-muted rounded animate-pulse mb-1" />
                          <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="bg-muted/30 p-2 rounded-lg">
                          <div className="h-3 w-16 bg-muted rounded animate-pulse mb-1" />
                          <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="h-3 w-20 bg-muted rounded animate-pulse mb-1" />
                        <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends Skeletons */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                <div className="h-5 w-36 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-3 text-center">
                      <div className="h-3 w-16 bg-muted rounded animate-pulse mx-auto mb-2" />
                      <div className="h-5 w-20 bg-muted rounded animate-pulse mx-auto mb-1" />
                      <div className="h-3 w-12 bg-muted rounded animate-pulse mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loading Indicator */}
          <div className="flex justify-center items-center py-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
              <Loader2 className="h-8 w-8 animate-spin text-primary relative" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
