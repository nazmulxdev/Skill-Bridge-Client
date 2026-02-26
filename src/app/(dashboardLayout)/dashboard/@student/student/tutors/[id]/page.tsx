import { getStudentProfile } from "@/actions/atudent.action";
import { DashboardTutorCompleteProfile } from "@/components/Dashboard/Student/DashboardTutorCompleteProfile";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";

import { publicService } from "@/services/public.service";
import { notFound } from "next/navigation";

interface TutorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TutorPage({ params }: TutorPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  // Fetch tutor data
  const { data: tutor, error } = await publicService.getTutorById(id);

  // Handle API error
  if (error || !tutor) {
    return <ErrorDisplay error={error} data={tutor} />;
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
    return <ErrorDisplay error={error} data={tutor} />;
  }

  return (
    <DashboardTutorCompleteProfile
      tutor={tutor}
      studentProfile={studentProfile}
    />
  );
}
