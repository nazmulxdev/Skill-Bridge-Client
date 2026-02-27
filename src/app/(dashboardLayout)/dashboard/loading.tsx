export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Sidebar Skeleton */}
      <div className="fixed inset-y-0 left-0 w-72 bg-card/80 backdrop-blur-xl border-r border-border/40">
        <div className="p-6 space-y-6">
          {/* Logo skeleton */}
          <div className="h-8 w-32 bg-muted rounded-lg animate-pulse" />

          {/* User info skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Navigation items skeleton */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Header skeleton */}
        <header className="sticky top-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border/40">
          <div className="flex items-center justify-between h-full px-6">
            <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
          </div>
        </header>

        {/* Content skeleton */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
              <div className="h-8 w-64 bg-muted rounded animate-pulse" />
              <div className="h-4 w-96 bg-muted rounded animate-pulse" />
            </div>

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>

            {/* Content cards skeleton */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
