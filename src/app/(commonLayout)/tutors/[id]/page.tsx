import { getStudentProfile } from "@/actions/atudent.action";
import { TutorCompleteProfile } from "@/components/TutorPage/TutorCompleteProfile";

import { publicService } from "@/services/public.service";
import { notFound } from "next/navigation";

interface TutorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "Tutor Profile",
  description: "See teacher's full details for booking slots.",
};

export default async function TutorPage({ params }: TutorPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  // Fetch tutor data
  const { data: tutor, error } = await publicService.getTutorById(id);

  // Handle API error
  if (error || !tutor) {
    notFound();
  }

  if (!tutor.userId || !tutor.user) {
    notFound();
  }

  let studentProfile = null;
  try {
    const studentData = await getStudentProfile();
    if (studentData?.data) {
      studentProfile = studentData.data;
    }
  } catch (error) {
    console.log("Student not logged in or error fetching profile:", error);
  }

  return <TutorCompleteProfile tutor={tutor} studentProfile={studentProfile} />;
}
