import { TutorCompleteAvailability } from "@/components/Dashboard/Tutor/TutorCompleteAvailability";
import { tutorService } from "@/services/tutor.service.server";

export default async function AvailabilityPage() {
  const res = await tutorService.getTutorProfile();
  const { data, error } = res;
  return (
    <div>
      <TutorCompleteAvailability tutorProfile={data?.tutorProfiles} />
    </div>
  );
}
