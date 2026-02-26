import {
  getAllSubjectsByAdmin,
  getAllCategoriesByAdmin,
} from "@/actions/admin.action";
import { DashboardAdminSubjectsClient } from "@/components/Dashboard/Admin/DashboardAdminSubjectsClient";

import { redirect } from "next/navigation";

export default async function AdminSubjectsPage() {
  const [subjectsResult, categoriesResult] = await Promise.all([
    getAllSubjectsByAdmin(),
    getAllCategoriesByAdmin(),
  ]);

  const { data: subjects, error: subjectsError } = subjectsResult;
  const { data: categories, error: categoriesError } = categoriesResult;

  if (subjectsError || !subjects || categoriesError || !categories) {
    redirect("/login");
  }
  console.log("categories", categories);
  console.log("subjects", subjects);

  return (
    <DashboardAdminSubjectsClient
      initialSubjects={subjects}
      initialCategories={categories}
    />
  );
}
