import { getAllUsersByAdmin } from "@/actions/admin.action";
import { DashboardAdminUsersClient } from "@/components/Dashboard/Admin/DashboardAdminUsersClient";

import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const { data: users, error } = await getAllUsersByAdmin();

  if (error || !users) {
    redirect("/login");
  }

  return <DashboardAdminUsersClient initialUsers={users} />;
}
