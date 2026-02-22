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

  const tutorProfile = user.tutorProfiles;
  const hasProfile = user.tutorProfiles !== null;

  // checking steps
  const isStep1Complete = hasProfile && tutorProfile?.hourlyRate != null;
  const isStep2Complete = (tutorProfile?.education?.length || 0) > 0;
  const isStep3Complete = (tutorProfile?.subjects?.length || 0) > 0;
  const isStep4Complete = (tutorProfile?.availabilities?.length || 0) > 0;
  const isStep5Complete = (tutorProfile?.tutorTimeSlots?.length || 0) > 0;

  // Determine which step is currently active
  const getCurrentStep = () => {
    if (!isStep1Complete) return 1;
    if (!isStep2Complete) return 2;
    if (!isStep3Complete) return 3;
    if (!isStep4Complete) return 4;
    if (!isStep5Complete) return 5;
    return 5; // All complete
  };

  const currentStep = getCurrentStep();
  const hasCompletedProfile = isTutor && currentStep === 5;

  // Base profile card component to avoid duplication
  const ProfileCard = ({ children }: { children?: React.ReactNode }) => (
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
              {isTutor && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  Step {currentStep}/5
                </span>
              )}
            </div>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );

  // If not a tutor, show basic profile without step info
  if (!isTutor) {
    return <ProfileCard />;
  }

  // If tutor with incomplete profile, show warning
  if (!hasCompletedProfile) {
    return (
      <ProfileCard>
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Complete Your Tutor Profile
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm mb-3">
              You need to complete your tutor profile before you can start
              teaching. Set up your hourly rate, education, subjects, and
              availability to get started.
            </p>
            <div className="text-sm">
              <p className="font-medium">Progress: Step {currentStep} of 5</p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </ProfileCard>
    );
  }

  // If tutor with complete profile, show basic profile
  return <ProfileCard />;
}
