import { getAllPublicTutor } from "@/actions/public.action";
import { getAllCategoryWithSubject } from "@/actions/tutor.action";
import { DashboardTutorsClient } from "@/components/Dashboard/Student/DashboardTeachersClient";
import { TutorsPageProps } from "@/types";

export default async function TutorsPage({ searchParams }: TutorsPageProps) {
  const { search, category, minPrice, maxPrice, rating, page } =
    await searchParams;
  const categoriesData = await getAllCategoryWithSubject();
  const categories = categoriesData.data || [];
  const params = {
    search: search || undefined,
    category: category || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    rating: rating ? Number(rating) : undefined,
    page: page ? Number(page) : 1,
    limit: 9,
  };

  const { data, error } = await getAllPublicTutor(params);
  console.log(data);

  return (
    <DashboardTutorsClient
      initialData={data}
      initialError={error}
      initialParams={{ search, category, minPrice, maxPrice, rating, page }}
      categories={categories}
    />
  );
}
