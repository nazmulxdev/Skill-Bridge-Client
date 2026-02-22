import { TutorBasicProfile } from "@/components/Dashboard/Tutor/TutorBasicProfile";
import { TutorCompleteProfile } from "@/components/Dashboard/Tutor/TutorCompleteProfile";
import { TutorSetup } from "@/components/Dashboard/Tutor/TutorProfileSetUp"; // Make sure this import path is correct
import { tutorService } from "@/services/tutor.service.server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

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
        <TutorCompleteProfile userData={data} />
      )}
    </div>
  );
}
