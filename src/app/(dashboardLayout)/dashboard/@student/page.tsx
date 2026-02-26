import { getStudentProfile } from "@/actions/atudent.action";
import { DashboardRootPageClient } from "@/components/Dashboard/Student/DashboardRootPageClient";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";
import { notFound, redirect } from "next/navigation";

export default async function StudentDashboardPage() {
  const { data: student, error } = await getStudentProfile();

  if (error || !student) {
    return <ErrorDisplay error={error} data={student} />;
  }

  return <DashboardRootPageClient student={student} />;
}
