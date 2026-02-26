import { getAllUsersByAdmin } from "@/actions/admin.action";
import { DashboardAdminTutorsClient } from "@/components/Dashboard/Admin/DashboardAdminTutorsClient";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";

import { redirect } from "next/navigation";

export default async function AdminTutorsPage() {
  const { data: users, error } = await getAllUsersByAdmin();

  if (error || !users) {
    return <ErrorDisplay error={error} data={users} />;
  }

  const tutors = users.filter((user: any) => user.role === "TUTOR");

  return <DashboardAdminTutorsClient initialTutors={tutors} />;
}
