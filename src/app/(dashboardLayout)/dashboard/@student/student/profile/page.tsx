import { getStudentProfile } from "@/actions/atudent.action";
import { DashboardStudentProfileClient } from "@/components/Dashboard/Student/DashboardStudentProfileClient";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";
import { notFound } from "next/navigation";

export default async function StudentProfilePage() {
  const { data: student, error } = await getStudentProfile();

  if (error || !student) {
    return <ErrorDisplay error={error} data={student} />;
  }
  if (student.role !== "STUDENT") {
    notFound();
  }

  return <DashboardStudentProfileClient student={student} />;
}
