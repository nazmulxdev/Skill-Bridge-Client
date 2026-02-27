// app/(dashboardLayout)/dashboard/admin/stats/page.tsx
import {
  getAllUsersByAdmin,
  allBookings,
  getAllCategoriesByAdmin,
  getAllSubjectsByAdmin,
} from "@/actions/admin.action";
import { DashboardAdminRoot } from "@/components/Dashboard/Admin/DashboardAdminRoot";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";

export default async function AdminStatsPage() {
  const [usersRes, bookingsRes, categoriesRes, subjectsRes] = await Promise.all(
    [
      getAllUsersByAdmin(),
      allBookings(),
      getAllCategoriesByAdmin(),
      getAllSubjectsByAdmin(),
    ],
  );

  if (usersRes.error || !usersRes.data) {
    return <ErrorDisplay error={usersRes.error} data={usersRes.data} />;
  }

  if (bookingsRes.error || !bookingsRes.data) {
    return <ErrorDisplay error={bookingsRes.error} data={bookingsRes.data} />;
  }

  if (categoriesRes.error || !categoriesRes.data) {
    return (
      <ErrorDisplay error={categoriesRes.error} data={categoriesRes.data} />
    );
  }

  if (subjectsRes.error || !subjectsRes.data) {
    return <ErrorDisplay error={subjectsRes.error} data={subjectsRes.data} />;
  }

  return (
    <DashboardAdminRoot
      initialUsers={usersRes.data}
      initialBookings={bookingsRes.data}
      initialCategories={categoriesRes.data}
      initialSubjects={subjectsRes.data}
    />
  );
}
