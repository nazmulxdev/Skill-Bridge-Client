import { getAllCategoriesByAdmin } from "@/actions/admin.action";
import { DashboardAdminCategoriesClient } from "@/components/Dashboard/Admin/DashboardAdminCategoriesClient";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";

export default async function AdminCategoriesPage() {
  const { data: categories, error } = await getAllCategoriesByAdmin();

  if (error || !categories) {
    return <ErrorDisplay error={error} data={categories} />;
  }

  return <DashboardAdminCategoriesClient initialCategories={categories} />;
}
