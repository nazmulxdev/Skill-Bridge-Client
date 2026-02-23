import { Loader2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AvailabilityLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
        </div>
      </div>

      {/* Stats badge */}
      <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />

      {/* Main card */}
      <Card className="border-border/50">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                <div className="h-4 w-56 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Availability slots */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/5"
              >
                <div className="flex items-center gap-4">
                  {/* Day badge */}
                  <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
                  {/* Time range */}
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="h-px w-full bg-border/50 animate-pulse" />

          {/* Add button */}
          <div className="h-12 w-full bg-muted rounded-lg animate-pulse" />
        </CardContent>
      </Card>

      {/* Info card skeleton */}
      <Card className="border-border/50 bg-muted/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 rounded bg-muted animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator */}
      <div className="flex justify-center items-center py-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Clock className="h-5 w-5 text-white animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
