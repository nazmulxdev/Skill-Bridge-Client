import { getAllCategoriesByAdmin } from "@/actions/admin.action";
import { DashboardAdminCategoriesClient } from "@/components/Dashboard/Admin/DashboardAdminCategoriesClient";

import { redirect } from "next/navigation";

export default async function AdminCategoriesPage() {
  const { data: categories, error } = await getAllCategoriesByAdmin();

  if (error || !categories) {
    redirect("/login");
  }

  return <DashboardAdminCategoriesClient initialCategories={categories} />;
}
