import {
  getAllSubjectsByAdmin,
  getAllCategoriesByAdmin,
} from "@/actions/admin.action";
import { DashboardAdminSubjectsClient } from "@/components/Dashboard/Admin/DashboardAdminSubjectsClient";
import { ErrorDisplay } from "@/components/GlobalComponent/ErrorDisplay";

export default async function AdminSubjectsPage() {
  const [subjectsResult, categoriesResult] = await Promise.all([
    getAllSubjectsByAdmin(),
    getAllCategoriesByAdmin(),
  ]);

  const { data: subjects, error: subjectsError } = subjectsResult;

  if (subjectsError || !subjects) {
    return <ErrorDisplay error={subjectsError} data={subjects} />;
  }

  const { data: categories, error: categoriesError } = categoriesResult;

  if (categoriesError || !categories) {
    return <ErrorDisplay error={categoriesError} data={categories} />;
  }

  return (
    <DashboardAdminSubjectsClient
      initialSubjects={subjects}
      initialCategories={categories}
    />
  );
}
