import { TutorCompleteReviews } from "@/components/Dashboard/Tutor/TutorCompleteReviews";
import { tutorService } from "@/services/tutor.service.server";
import { notFound } from "next/navigation";

export default async function ReviewsPage() {
  const { data, error } = await tutorService.getTutorProfile();

  if (error || !data) {
    notFound();
  }

  const { tutorProfiles } = data;

  return (
    <div className="container mx-auto py-8">
      <TutorCompleteReviews tutorProfile={tutorProfiles} />
    </div>
  );
}
