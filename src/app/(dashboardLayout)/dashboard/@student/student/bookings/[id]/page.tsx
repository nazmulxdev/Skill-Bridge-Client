import { getStudentProfile } from "@/actions/atudent.action";
import { DashboardSessionClient } from "@/components/Dashboard/Student/DashboardSessionClient";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";
import { notFound, redirect } from "next/navigation";

interface SessionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;

  // Get student profile
  const { data: student, error: studentError } = await getStudentProfile();

  if (studentError || !student) {
    return <ErrorDisplay error={studentError} data={student} />;
  }

  if (student.role !== "STUDENT") {
    notFound();
  }

  // Find the specific booking
  const booking = student.bookings?.find((b: any) => b.id === id);

  if (!booking) {
    notFound();
  }

  // Only confirmed bookings can be accessed
  if (booking.status !== "CONFIRM") {
    redirect("/dashboard/student/bookings");
  }

  return <DashboardSessionClient booking={booking} student={student} />;
}
