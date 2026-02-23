import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TutorLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header skeleton */}
      <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-muted animate-pulse ring-4 ring-primary/10" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
              <div className="flex gap-3">
                <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs skeleton */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          {/* Tab buttons skeleton */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-20 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-muted/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
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
