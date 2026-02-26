import { getStudentProfile } from "@/actions/atudent.action";
import { DashboardStudentReviewsClient } from "@/components/Dashboard/Student/DashboardStudentReviewsClient";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";
import { notFound } from "next/navigation";

export default async function StudentReviewsPage() {
  const { data: student, error } = await getStudentProfile();

  if (error || !student) {
    return <ErrorDisplay error={error} data={student} />;
  }

  if (student.role !== "STUDENT") {
    notFound();
  }

  return <DashboardStudentReviewsClient student={student} />;
}
