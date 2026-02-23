import { TutorBookings } from "@/components/Dashboard/Tutor/TutorBookings";
import { tutorService } from "@/services/tutor.service.server";

export default async function TutorBookingPage() {
  const res = await tutorService.getTutorProfile();
  const { data, error } = res;

  console.log(data);
  return (
    <div>
      <TutorBookings bookings={data?.tutorProfiles?.bookings} />
    </div>
  );
}
