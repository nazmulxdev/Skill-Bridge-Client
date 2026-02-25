import { Loader2, User } from "lucide-react";

export default function TutorProfileLoading() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button Skeleton */}
          <div className="mb-6">
            <div className="h-8 w-24 bg-muted rounded-lg animate-pulse" />
          </div>

          {/* Profile Header Skeleton */}
          <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden mb-8">
            <div className="h-32 bg-gradient-to-r from-muted/50 via-muted/30 to-transparent" />
            <div className="px-6 pb-6">
              <div className="relative -mt-16 mb-4">
                <div className="h-24 w-24 rounded-full bg-muted animate-pulse ring-4 ring-background" />
              </div>
              <div className="space-y-3">
                <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card/50 border border-border/50 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden">
            <div className="border-b border-border/40 p-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-20 bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-16 w-full bg-muted/50 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
