import { TutorCompleteSubjects } from "@/components/Dashboard/Tutor/TutorCompleteSubjects";
import { tutorService } from "@/services/tutor.service.server";

export default async function TutorSubjectsPage() {
  const res = await tutorService.getTutorProfile();
  const { data, error } = res;
  return (
    <div>
      <TutorCompleteSubjects tutorProfile={data.tutorProfiles} />
    </div>
  );
}
