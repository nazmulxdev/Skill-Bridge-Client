import { Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ReviewsLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
        <div>
          <div className="h-8 w-36 bg-muted rounded animate-pulse" />
          <div className="h-4 w-52 bg-muted rounded animate-pulse mt-2" />
        </div>
      </div>

      {/* Rating summary card */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Average rating */}
            <div className="text-center">
              <div className="h-16 w-16 bg-muted rounded-full animate-pulse mx-auto" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse mt-2 mx-auto" />
            </div>

            {/* Rating bars */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  <div className="flex-1 h-2 bg-muted rounded-full animate-pulse" />
                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews list */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              {/* Review header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className="h-3 w-3 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              </div>

              {/* Review comment */}
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted/50 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-muted/50 rounded animate-pulse" />
              </div>

              {i < 4 && <div className="h-px w-full bg-border/50 my-4" />}
            </div>
          ))}
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
