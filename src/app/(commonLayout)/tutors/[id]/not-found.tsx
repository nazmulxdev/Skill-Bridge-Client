import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Home } from "lucide-react";

export default function TutorNotFound() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="h-24 w-24 rounded-full bg-muted mx-auto flex items-center justify-center">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Tutor Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The tutor you're looking for doesn't exist or may have been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/tutors">
                <User className="h-4 w-4 mr-2" />
                Browse Tutors
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
