import { getAllUsersByAdmin } from "@/actions/admin.action";
import { DashboardAdminTutorsClient } from "@/components/Dashboard/Admin/DashboardAdminTutorsClient";

import { redirect } from "next/navigation";

export default async function AdminTutorsPage() {
  const { data: users, error } = await getAllUsersByAdmin();

  if (error || !users) {
    redirect("/login");
  }

  const tutors = users.filter((user: any) => user.role === "TUTOR");

  return <DashboardAdminTutorsClient initialTutors={tutors} />;
}
