import { Loader2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SubjectsLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header with back button skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
        </div>
      </div>

      {/* Stats badges skeleton */}
      <div className="flex gap-3">
        <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
        <div className="h-6 w-28 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Main card skeleton */}
      <Card className="border-border/50">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
              <div className="h-4 w-56 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Subjects by category skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((category) => (
              <div key={category} className="space-y-3">
                {/* Category header */}
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted animate-pulse" />
                  <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                </div>

                {/* Subject badges */}
                <div className="flex flex-wrap gap-2 pl-4">
                  {[1, 2, 3, 4].map((subject) => (
                    <div
                      key={subject}
                      className="h-8 w-24 bg-muted rounded-full animate-pulse"
                      style={{ animationDelay: `${subject * 50}ms` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="h-px w-full bg-border/50 animate-pulse" />

          {/* Add subject form skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 h-11 bg-muted rounded-lg animate-pulse" />
              <div className="h-11 w-32 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Info cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {[1, 2].map((i) => (
              <Card key={i} className="border-border/50 bg-muted/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded bg-muted animate-pulse shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-full bg-muted rounded animate-pulse" />
                      <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator */}
      <div className="flex justify-center items-center py-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
