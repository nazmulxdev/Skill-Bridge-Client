"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAllPublicTutor } from "@/actions/public.action";
import { Loader2, AlertCircle, FilterX } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TutorsFilters } from "@/components/TutorPage/TeachersFilter";
import { DashboardTutorsGrid } from "./DashboardTeachersGrid";
import { TutorsPagination } from "@/components/TutorPage/TeachersPagination";

interface TutorsClientProps {
  initialData: any;
  initialError: any;
  initialParams: any;
  categories: any[];
}

export function DashboardTutorsClient({
  initialData,
  initialError,
  initialParams,
  categories,
}: TutorsClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [tutors, setTutors] = useState(initialData?.data || []);
  const [meta, setMeta] = useState(
    initialData?.meta || { page: 1, totalPage: 1, total: 0, limit: 9 },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  // State with limit included
  const [filters, setFilters] = useState({
    search: initialParams.search || "",
    category: initialParams.category || "",
    minPrice: initialParams.minPrice || "",
    maxPrice: initialParams.maxPrice || "",
    rating: initialParams.rating || "",
    limit: initialParams.limit || "9",
    page: initialParams.page || "1",
  });

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      setError(null);

      const params: any = {
        page: filters.page ? Number(filters.page) : 1,
        limit: filters.limit ? Number(filters.limit) : 9,
      };

      if (filters.search && filters.search.trim() !== "") {
        params.search = filters.search;
      }

      if (filters.category && filters.category !== "all") {
        params.category = filters.category;
      }

      if (filters.minPrice && filters.minPrice !== "") {
        params.minPrice = Number(filters.minPrice);
      }

      if (filters.maxPrice && filters.maxPrice !== "") {
        params.maxPrice = Number(filters.maxPrice);
      }

      if (filters.rating && filters.rating !== "all") {
        params.rating = Number(filters.rating);
      }

      const { data, error } = await getAllPublicTutor(params);

      if (error) {
        setError(error);
      } else {
        setTutors(data?.data || []);
        setMeta(
          data?.meta || {
            page: 1,
            totalPage: 1,
            total: 0,
            limit: Number(filters.limit),
          },
        );
        setError(null);
      }

      setLoading(false);
    };

    const urlParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all") {
        urlParams.set(key, value);
      }
    });

    const queryString = urlParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl, { scroll: false });

    fetchTutors();
  }, [filters, pathname, router]);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: "1",
    }));
  };

  const goToPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page: page.toString() }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      rating: "all",
      limit: "9",
      page: "1",
    });
  };

  // Count active filters
  const activeFilterCount = [
    filters.search,
    filters.category !== "all" && filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.rating !== "all" && filters.rating,
  ].filter(Boolean).length;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Main Content - Full Width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Find Your Perfect Tutor
              </h1>
              <p className="text-muted-foreground mt-2">
                Browse through {meta.total}+ expert tutors and find the right
                match for you
              </p>
            </div>

            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary px-3 py-1"
                >
                  {activeFilterCount} active{" "}
                  {activeFilterCount === 1 ? "filter" : "filters"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="gap-2 text-muted-foreground hover:text-destructive"
                >
                  <FilterX className="h-4 w-4" />
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filters - Full width with centered content */}
        <div className="max-w-7xl mx-auto">
          <TutorsFilters
            filters={filters}
            onFilterChange={updateFilter}
            categories={categories}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-16 max-w-7xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
              <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
            </div>
            <p className="text-muted-foreground mt-4 animate-pulse">
              Finding the best tutors for you...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-7xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load tutors:{" "}
                {typeof error === "object" ? JSON.stringify(error) : error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Tutors Grid */}
        {!loading && !error && (
          <div className="max-w-7xl mx-auto">
            <DashboardTutorsGrid tutors={tutors || []} />
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && meta?.totalPage > 1 && (
          <div className="max-w-7xl mx-auto">
            <TutorsPagination
              currentPage={meta.page}
              totalPages={meta.totalPage}
              onPageChange={goToPage}
            />
          </div>
        )}

        {/* Results Summary */}
        {!loading && !error && tutors.length > 0 && (
          <div className="max-w-7xl mx-auto mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {tutors.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{meta.total}</span>{" "}
              tutors
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
