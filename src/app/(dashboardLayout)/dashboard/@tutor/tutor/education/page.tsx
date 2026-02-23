import { TutorCompleteEducation } from "@/components/Dashboard/Tutor/TutorCompleteEducation";
import { tutorService } from "@/services/tutor.service.server";

export default async function TutorEducationPage() {
  const res = await tutorService.getTutorProfile();
  const { data, error } = res;
  return (
    <div>
      <TutorCompleteEducation tutorProfile={data.tutorProfiles} />
    </div>
  );
}
