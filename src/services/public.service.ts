// get tutor with params

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

      const res = await fetch(url.toString(), {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
        next: {
          tags: ["public-tutors"],
        },
      });
      const data = await res.json();
      if (!data.success) {
        return { data: null, error: data.error };
      }
      return { data: data.data, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  },
};
