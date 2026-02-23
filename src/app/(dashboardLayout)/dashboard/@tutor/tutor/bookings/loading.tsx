import { Loader2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BookingsLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
        <div>
          <div className="h-8 w-40 bg-muted rounded animate-pulse" />
          <div className="h-4 w-56 bg-muted rounded animate-pulse mt-2" />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-8 w-12 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-9 w-20 bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
        <div className="h-9 w-40 bg-muted rounded-lg animate-pulse" />
      </div>

      {/* Bookings list */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Student info */}
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                  </div>
                </div>

                {/* Booking details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="flex justify-center items-center py-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-white animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
