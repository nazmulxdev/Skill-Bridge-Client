import { TutorBasicProfile } from "@/components/Dashboard/Tutor/TutorBasicProfile";
import { TutorSetup } from "@/components/Dashboard/Tutor/TutorProfileSetUp"; // Make sure this import path is correct
import { tutorService } from "@/services/tutor.service.server";

export default async function TutorProfile() {
  const { data, error } = await tutorService.getTutorProfile();

  // Handle error
  if (error || !data) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <h2 className="font-semibold">Error loading profile</h2>
          <p className="text-sm">
            {error?.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  const { role, tutorProfiles } = data;

  // Check if user is TUTOR
  if (role !== "TUTOR") {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-warning/10 text-warning p-4 rounded-lg">
          <h2 className="font-semibold">Access Denied</h2>
          <p className="text-sm">You need to be a tutor to access this page.</p>
        </div>
      </div>
    );
  }

  // Check if profile exists
  const hasProfile = tutorProfiles !== null;

  // Check if profile is complete (has all required fields)
  // You can define what "complete" means - for example:
  const isProfileComplete =
    hasProfile &&
    tutorProfiles?.hourlyRate &&
    tutorProfiles?.education?.length > 0 &&
    tutorProfiles?.subjects?.length > 0;

  console.log({
    role,
    hasProfile,
    isProfileComplete,
    tutorProfiles,
  });

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Always show basic profile info */}
      <TutorBasicProfile user={data} />

      {/* Show setup wizard if profile is incomplete */}
      {(!hasProfile || !isProfileComplete) && (
        <TutorSetup userData={data} tutorProfile={tutorProfiles} />
      )}

      {/* Show regular dashboard if profile is complete */}
      {hasProfile && isProfileComplete && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Your Tutor Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-6 rounded-lg border border-border/50">
              <h3 className="font-semibold mb-2">Today's Schedule</h3>
              <p className="text-muted-foreground">You have 3 sessions today</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border/50">
              <h3 className="font-semibold mb-2">Total Earnings</h3>
              <p className="text-2xl font-bold text-primary">$1,245</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border/50">
              <h3 className="font-semibold mb-2">Student Reviews</h3>
              <p className="text-2xl font-bold text-primary">4.9 ★</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
