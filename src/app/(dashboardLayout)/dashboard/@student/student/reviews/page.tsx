import { getStudentProfile } from "@/actions/atudent.action";
import { DashboardStudentReviewsClient } from "@/components/Dashboard/Student/DashboardStudentReviewsClient";
import { notFound, redirect } from "next/navigation";

export default async function StudentReviewsPage() {
  const { data: student, error } = await getStudentProfile();

  if (error || !student) {
    redirect("/login");
  }

  if (student.role !== "STUDENT") {
    notFound();
  }

  return <DashboardStudentReviewsClient student={student} />;
}
