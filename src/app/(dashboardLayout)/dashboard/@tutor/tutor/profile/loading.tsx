import { Loader2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TutorProfileLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header card */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted animate-pulse ring-2 ring-primary/10" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-56 bg-muted rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
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

      {/* Tabs */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          {/* Tab buttons */}
          <div className="flex gap-2 mb-6 border-b border-border/40 pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-9 w-20 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* Tab content */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-muted/5 rounded-lg"
              >
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator */}
      <div className="flex justify-center items-center py-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <User className="h-5 w-5 text-white animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
