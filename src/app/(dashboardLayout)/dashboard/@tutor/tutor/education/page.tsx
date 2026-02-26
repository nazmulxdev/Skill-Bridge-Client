import { TutorCompleteEducation } from "@/components/Dashboard/Tutor/TutorCompleteEducation";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";
import { tutorService } from "@/services/tutor.service.server";

export default async function TutorEducationPage() {
  const res = await tutorService.getTutorProfile();
  const { data, error } = res;

  if (error || !data) {
    return <ErrorDisplay error={error} data={data} />;
  }

  return (
    <div>
      <TutorCompleteEducation tutorProfile={data.tutorProfiles} />
    </div>
  );
}
