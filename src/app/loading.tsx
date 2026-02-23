import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="text-center space-y-4">
        <div className="relative">
          {/* Animated rings */}
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
          <div className="absolute inset-2 rounded-full animate-pulse bg-primary/30" />

          {/* Center icon */}
          <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/25">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Skill Bridge
          </h2>
          <p className="text-muted-foreground animate-pulse">
            Loading amazing content for you...
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1.5 mx-auto bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-progress" />
        </div>
      </div>
    </div>
  );
}
