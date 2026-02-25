import { Loader2, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SessionLoading() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full h-screen flex flex-col">
        {/* Header Skeleton */}
        <header className="bg-card/80 backdrop-blur-xl border-b border-border/40 px-3 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
              <div className="h-8 w-16 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Video Area */}
          <div className="flex-1 p-2 sm:p-4">
            <div className="h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl relative">
              {/* Loading Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                      <Video className="h-8 w-8 sm:h-10 sm:w-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-white text-base sm:text-lg font-semibold">
                    Loading Session...
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm">
                    Please wait while we connect you
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Skeleton */}
        <footer className="bg-card/80 backdrop-blur-xl border-t border-border/40 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted animate-pulse"
              />
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
