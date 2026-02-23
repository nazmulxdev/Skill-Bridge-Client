import { TutorRootPage } from "@/components/Dashboard/Tutor/TutorRootPage";
import { tutorService } from "@/services/tutor.service.server";

export default async function TutorPage() {
  const { data, error } = await tutorService.getTutorProfile();

  if (error || !data) {
    return <div>Error loading profile</div>;
  }

  const { tutorProfiles } = data;

  return (
    <div className="container mx-auto py-8">
      <TutorRootPage userData={data} tutorProfile={tutorProfiles} />
    </div>
  );
}
