import { getStudentProfile } from "@/actions/atudent.action";
import { DashboardStudentProfileClient } from "@/components/Dashboard/Student/DashboardStudentProfileClient";
import { notFound, redirect } from "next/navigation";

export default async function StudentProfilePage() {
  const { data: student, error } = await getStudentProfile();

  if (error || !student) {
    redirect("/login");
  }

  if (student.role !== "STUDENT") {
    notFound();
  }

  return <DashboardStudentProfileClient student={student} />;
}
