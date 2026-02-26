// components/ErrorDisplay.tsx
"use client";

import { Home, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ErrorDetail {
  field: string;
  message: string;
}

interface AppError {
  success: boolean;
  error: {
    code: string;
    details?: ErrorDetail[];
    message: string;
    name: string;
    statusCode: number;
  };
  path?: string;
  timestamp?: string;
}

interface ErrorDisplayProps {
  error: AppError | any;
  data?: any;
}

export function ErrorDisplay({ error, data }: ErrorDisplayProps) {
  const [mounted, setMounted] = useState(false);
  const [formattedTimestamp, setFormattedTimestamp] = useState("");
  const [particles, setParticles] = useState<
    Array<{
      width: string;
      height: string;
      left: string;
      top: string;
      delay: string;
      duration: string;
    }>
  >([]);

  const router = useRouter();

  // Handle if error or no data
  if (!error && data) return null;

  useEffect(() => {
    setMounted(true);

    // Generate random particles only on client
    const newParticles = [...Array(20)].map(() => ({
      width: Math.random() * 10 + 5 + "px",
      height: Math.random() * 10 + 5 + "px",
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      delay: Math.random() * 5 + "s",
      duration: Math.random() * 10 + 10 + "s",
    }));
    setParticles(newParticles);

    // Format timestamp on client only
    const timestamp = error?.timestamp || new Date().toISOString();
    setFormattedTimestamp(new Date(timestamp).toLocaleString());
  }, [error?.timestamp]);

  const errorMessage =
    error?.error?.message || error?.message || "Please try again later";
  const errorCode = error?.error?.code || error?.code || "UNKNOWN_ERROR";
  const statusCode = error?.error?.statusCode || error?.statusCode || 500;
  const errorDetails = error?.error?.details || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-destructive/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-destructive/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-destructive/10 blur-3xl animate-pulse delay-700" />
      </div>

      {/* Floating particles - Only render on client with generated values */}
      {mounted && particles.length > 0 && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-muted/20 animate-float"
              style={{
                width: particle.width,
                height: particle.height,
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Main error card */}
      <div className="relative max-w-2xl w-full group">
        <div className="relative transform-gpu transition-all duration-500 group-hover:rotate-1 group-hover:scale-105">
          {/* Glowing border effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-destructive via-destructive/60 to-destructive/40 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

          {/* Main card */}
          <div className="relative backdrop-blur-xl bg-card/40 border border-border/20 rounded-3xl shadow-2xl overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent" />

            {/* Status code badge */}
            <div className="absolute top-6 right-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-destructive to-destructive/60 rounded-full blur-md opacity-50 animate-pulse" />
                <div className="relative px-4 py-2 bg-card/50 backdrop-blur-md border border-border/20 rounded-full">
                  <span className="text-sm font-mono text-foreground/90">
                    {statusCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              {/* Animated icon */}
              <div className="relative mb-8 flex justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-r from-destructive/30 to-destructive/20 animate-ping" />
                  <div className="absolute h-40 w-40 rounded-full bg-gradient-to-r from-destructive/20 to-destructive/10 animate-pulse blur-xl" />
                </div>

                <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-destructive via-destructive/80 to-destructive/60 p-1">
                  <div className="h-full w-full rounded-full bg-card backdrop-blur-xl flex items-center justify-center">
                    <svg
                      className="h-16 w-16 text-destructive animate-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Error title */}
              <div className="text-center mb-6">
                <h1 className="text-5xl md:text-6xl font-black mb-4">
                  <span className="bg-gradient-to-r from-destructive via-destructive/80 to-destructive/60 bg-clip-text text-transparent">
                    Access Denied
                  </span>
                </h1>

                {/* Error code pill */}
                <div className="inline-block mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-destructive to-destructive/60 rounded-full blur-md opacity-50 animate-pulse" />
                    <div className="relative px-4 py-2 bg-card/50 backdrop-blur-md border border-border/20 rounded-full">
                      <span className="text-sm font-mono text-foreground/80">
                        {errorCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main error message */}
              <div className="relative mb-8 p-6 bg-muted/20 backdrop-blur-sm rounded-2xl border border-border/10">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-destructive to-destructive/60 rounded-full animate-pulse" />
                <p className="text-xl md:text-2xl font-medium text-foreground/90 text-center">
                  {errorMessage}
                </p>
              </div>

              {/* Error details */}
              {errorDetails.length > 0 && (
                <div className="mb-8 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-center">
                    Additional Details
                  </p>
                  {errorDetails.map((detail: ErrorDetail, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-muted/20 backdrop-blur-sm rounded-xl border border-border/10 hover:bg-muted/30 transition-all duration-300"
                    >
                      <p className="text-sm text-foreground/80">
                        <span className="font-mono text-primary">
                          {detail.field}:
                        </span>{" "}
                        {detail.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Timestamp - Only render after mounted */}
              <div className="text-center mb-8">
                <p className="text-xs text-muted-foreground">
                  {mounted ? formattedTimestamp : ""}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="relative group/btn px-8 py-4 rounded-xl overflow-hidden transition-all duration-300 border border-border/20 hover:border-border/40"
                >
                  <div className="absolute inset-0 bg-muted/5 group-hover/btn:bg-muted/10 transition-colors" />
                  <span className="relative text-foreground font-semibold flex items-center gap-2">
                    <RefreshCcw className="h-5 w-5" />
                    Try Again
                  </span>
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="relative group/btn px-8 py-4 rounded-xl overflow-hidden transition-all duration-300 border border-border/20 hover:border-border/40"
                >
                  <div className="absolute inset-0 bg-muted/5 group-hover/btn:bg-muted/10 transition-colors" />
                  <span className="relative text-foreground font-semibold flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Go Home
                  </span>
                </button>
              </div>
            </div>

            {/* Decorative bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive via-destructive/60 to-destructive/40" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
