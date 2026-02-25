import { getStudentProfile } from "@/actions/atudent.action";
import { getAllPublicTutor } from "@/actions/public.action";
import { TutorCompleteProfile } from "@/components/TutorPage/TutorCompleteProfile";
import { notFound } from "next/navigation";

interface TutorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TutorPage({ params }: TutorPageProps) {
  const { id } = await params;

  // Fetch all tutors and find the one with matching userId
  const { data, error } = await getAllPublicTutor({ limit: 100 }); // Get enough tutors

  if (error || !data?.data) {
    notFound();
  }

  const tutor = data.data.find((t: any) => t.userId === id);

  if (!tutor) {
    notFound();
  }

  // Get current student profile if logged in (optional)
  let studentProfile = null;
  try {
    const studentData = await getStudentProfile();
    if (studentData.data) {
      studentProfile = studentData.data;
    }
  } catch (error) {
    // Student not logged in - that's fine
  }

  return <TutorCompleteProfile tutor={tutor} studentProfile={studentProfile} />;
}
