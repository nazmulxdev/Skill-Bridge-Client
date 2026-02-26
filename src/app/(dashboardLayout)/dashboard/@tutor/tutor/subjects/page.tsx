import { TutorCompleteSubjects } from "@/components/Dashboard/Tutor/TutorCompleteSubjects";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";
import { tutorService } from "@/services/tutor.service.server";

export default async function TutorSubjectsPage() {
  const res = await tutorService.getTutorProfile();
  const { data, error } = res;

  if (error || !data) {
    return <ErrorDisplay error={error} data={data} />;
  }

  return (
    <div>
      <TutorCompleteSubjects tutorProfile={data.tutorProfiles} />
    </div>
  );
}
