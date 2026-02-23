import { Loader2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function TimeSlotsLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header with back button skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
        <div>
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
        </div>
      </div>

      {/* Stats badges skeleton */}
      <div className="flex gap-3">
        <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
        <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Main card skeleton */}
      <Card className="border-border/50">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Time slots list skeleton */}
          <div className="space-y-4">
            {/* Date group skeleton */}
            {[1, 2, 3].map((group) => (
              <div key={group} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted animate-pulse" />
                  <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                </div>

                {/* Slot items */}
                <div className="space-y-2 pl-4">
                  {[1, 2].map((slot) => (
                    <div
                      key={slot}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                          <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                        <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Separator skeleton */}
          <div className="h-px w-full bg-border/50 animate-pulse" />

          {/* Create button skeleton */}
          <div className="h-12 w-full bg-muted rounded-lg animate-pulse" />
        </CardContent>
      </Card>

      {/* Centered loading indicator */}
      <div className="flex justify-center items-center py-8">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
