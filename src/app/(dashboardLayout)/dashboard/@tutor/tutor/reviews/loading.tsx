import { Loader2, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ReviewsLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header with back button skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
        </div>
      </div>

      {/* Stats badges skeleton */}
      <div className="flex gap-3">
        <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
        <div className="h-6 w-28 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Main card skeleton */}
      <Card className="border-border/50">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
              <div className="h-4 w-56 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Rating summary skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-muted/5">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse mt-2" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse mt-2" />
            </div>
            <div className="md:col-span-2 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                  <div className="flex-1 h-2 bg-muted rounded-full animate-pulse" />
                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Filters skeleton */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-9 w-12 bg-muted rounded animate-pulse"
                />
              ))}
            </div>
            <div className="h-9 w-40 bg-muted rounded animate-pulse" />
          </div>

          {/* Reviews list skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((review) => (
              <div
                key={review}
                className="p-6 rounded-xl border border-border/50 bg-muted/5"
              >
                {/* Review header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className="h-4 w-4 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>

                {/* Review comment */}
                <div className="pl-13 space-y-2">
                  <div className="h-3 w-full bg-muted/50 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-muted/50 rounded animate-pulse" />
                </div>

                {/* Review footer */}
                <div className="flex items-center gap-4 mt-4 pt-2 border-t border-border/40">
                  <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Info cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50 bg-muted/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded bg-muted animate-pulse shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-full bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator */}
      <div className="flex justify-center items-center py-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Star className="h-5 w-5 text-white animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
