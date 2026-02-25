import { getStudentProfile } from "@/actions/atudent.action";
import { DashboardRootPageClient } from "@/components/Dashboard/Student/DashboardRootPageClient";
import { notFound, redirect } from "next/navigation";

export default async function StudentDashboardPage() {
  const { data: student, error } = await getStudentProfile();

  if (error || !student) {
    redirect("/login");
  }

  if (student.role !== "STUDENT") {
    notFound();
  }

  return <DashboardRootPageClient student={student} />;
}
