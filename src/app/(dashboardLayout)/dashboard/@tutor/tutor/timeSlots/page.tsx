import { TutorCompleteTimeSlot } from "@/components/Dashboard/Tutor/TutorCompleteTimeSlot";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";
import { tutorService } from "@/services/tutor.service.server";

export default async function TutorTimeSlotPAge() {
  const res = await tutorService.getTutorProfile();
  const { data, error } = res;
  if (error || !data) {
    return <ErrorDisplay error={error} data={data} />;
  }

  return (
    <div>
      <TutorCompleteTimeSlot tutorProfile={data?.tutorProfiles} />
    </div>
  );
}
