import { TutorCompleteTimeSlot } from "@/components/Dashboard/Tutor/TutorCompleteTimeSlot";
import { tutorService } from "@/services/tutor.service.server";

export default async function TutorTimeSlotPAge() {
  const res = await tutorService.getTutorProfile();
  const { data, error } = res;
  return (
    <div>
      <TutorCompleteTimeSlot tutorProfile={data?.tutorProfiles} />
    </div>
  );
}
