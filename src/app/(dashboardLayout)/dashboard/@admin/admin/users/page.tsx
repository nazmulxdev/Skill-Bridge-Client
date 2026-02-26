import { getAllUsersByAdmin } from "@/actions/admin.action";
import { DashboardAdminUsersClient } from "@/components/Dashboard/Admin/DashboardAdminUsersClient";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";

import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const { data: users, error } = await getAllUsersByAdmin();

  if (error || !users) {
    return <ErrorDisplay error={error} data={users} />;
  }

  return <DashboardAdminUsersClient initialUsers={users} />;
}
