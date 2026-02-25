export interface TutorsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    page?: string;
  }>;
}
