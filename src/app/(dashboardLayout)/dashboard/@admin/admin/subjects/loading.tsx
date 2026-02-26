import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminSubjectsLoading() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between">
            <div>
              <div className="h-8 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-muted rounded animate-pulse" />
              <div className="h-9 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-6 w-12 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters Skeleton */}
          <Card className="border-border/50">
            <CardContent className="p-4 space-y-3">
              <div className="h-10 w-full bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>

          {/* Mobile Cards Skeleton */}
          <div className="lg:hidden space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                    <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table Skeleton */}
          <div className="hidden lg:block">
            <Card className="border-border/50">
              <CardHeader className="pb-2 px-6">
                <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

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
