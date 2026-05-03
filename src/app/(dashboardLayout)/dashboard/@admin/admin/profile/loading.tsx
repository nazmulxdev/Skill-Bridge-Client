// src/app/(dashboardLayout)/@admin/profile/loading.tsx
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminProfileLoading() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header Skeleton */}
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-muted animate-pulse ring-4 ring-background" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
                    <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Skeleton */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex gap-2 mb-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-24 bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted/50 rounded-lg animate-pulse"
                  />
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
