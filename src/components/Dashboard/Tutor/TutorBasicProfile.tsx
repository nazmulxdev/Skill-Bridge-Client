import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserDetailsProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
    tutorProfiles?: any | null;
  };
}

export function TutorBasicProfile({ user }: UserDetailsProps) {
  const isTutor = user.role === "TUTOR";
  const hasCompletedProfile = isTutor && user.tutorProfiles !== null;

  return (
    isTutor &&
    !hasCompletedProfile && (
      <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-xl bg-primary/10">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-semibold">
              Complete Your Tutor Profile
            </AlertTitle>
            <AlertDescription className="mt-2">
              <p className="text-sm mb-3">
                You need to complete your tutor profile before you can start
                teaching. Set up your hourly rate,education, subjects, and
                availability to get started.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  );
}
