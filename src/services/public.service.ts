import { env } from "@/env";

export interface IPublicParams {
  search?: string;
  rating?: number | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  category?: string | undefined;
  page?: number;
  limit?: number;
  skip?: number;
}

export const publicService = {
  getAllTutors: async function (params?: IPublicParams) {
    try {
      const url = new URL(`${env.API_URL}/public`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value);
          }
        });
      }

      console.log("🔍 Fetching URL:", url.toString());

      const res = await fetch(url.toString(), {
        cache: "no-store",
        next: {
          tags: ["public-tutors"],
        },
      });

      console.log("📡 Response status:", res.status);

      const data = await res.json();
      console.log(data);
      if (!data.success) {
        console.error("❌ API Error:", data.error);
        return { data: null, error: data.error };
      }

      // Check the structure of data.data
      console.log("✅ Success data structure:", {
        hasMeta: !!data.data?.meta,
        hasData: !!data.data?.data,
        meta: data.data?.meta,
        dataLength: data.data?.data?.length,
      });

      return { data: data.data, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  },
};
