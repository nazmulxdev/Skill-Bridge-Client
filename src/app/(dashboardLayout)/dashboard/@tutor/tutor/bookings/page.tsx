import { TutorBookings } from "@/components/Dashboard/Tutor/TutorBookings";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";
import { tutorService } from "@/services/tutor.service.server";

export default async function TutorBookingPage() {
  const res = await tutorService.getTutorProfile();
  const { data, error } = res;

  if (error || !data) {
    return <ErrorDisplay error={error} data={data} />;
  }

  return (
    <div>
      <TutorBookings bookings={data?.tutorProfiles?.bookings} />
    </div>
  );
}
