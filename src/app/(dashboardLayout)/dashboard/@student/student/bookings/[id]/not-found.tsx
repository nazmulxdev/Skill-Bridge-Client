import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Calendar, Home, ArrowLeft } from "lucide-react";

export default function SessionNotFound() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border/50 shadow-xl">
        <CardContent className="p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="h-24 w-24 rounded-full bg-destructive/10 mx-auto flex items-center justify-center">
              <Video className="h-12 w-12 text-destructive" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-3">Session Not Found</h1>

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            The session you're looking for doesn't exist or may have been ended.
          </p>

          {/* Session Details Placeholder */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Session could not be located</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="h-4 w-4" />
              <span>It may have been cancelled or removed</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default" className="gap-2">
              <Link href="/student/bookings">
                <ArrowLeft className="h-4 w-4" />
                Back to Bookings
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
