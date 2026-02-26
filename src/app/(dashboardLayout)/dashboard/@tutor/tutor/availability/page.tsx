import { TutorCompleteAvailability } from "@/components/Dashboard/Tutor/TutorCompleteAvailability";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";
import { tutorService } from "@/services/tutor.service.server";

export default async function AvailabilityPage() {
  const res = await tutorService.getTutorProfile();
  const { data, error } = res;
  if (error || !data) {
    return <ErrorDisplay error={error} data={data} />;
  }

  return (
    <div>
      <TutorCompleteAvailability tutorProfile={data?.tutorProfiles} />
    </div>
  );
}
