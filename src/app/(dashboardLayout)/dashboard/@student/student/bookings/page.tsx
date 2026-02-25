import { notFound, redirect } from "next/navigation";
import { DashboardBookingClient } from "@/components/Dashboard/Student/DashboardBookingsClient";
import { getStudentProfile } from "@/actions/atudent.action";

export default async function StudentBookingsPage() {
  const { data: student, error } = await getStudentProfile();

  if (error || !student) {
    redirect("/login");
  }

  if (student.role !== "STUDENT") {
    notFound();
  }

  return <DashboardBookingClient student={student} />;
}
