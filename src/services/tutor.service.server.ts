import { env } from "@/env";
import { cookies } from "next/headers";

export const tutorService = {
  getTutorProfile: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/tutors/me`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const data = await res.json();
      console.log(data);
      if (!data.success) {
        return {
          data: null,
          error: data.error,
        };
      }

      return { data: data.data, error: null };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: error,
      };
    }
  },

  // Get all subjects (for dropdown)
  getAllSubjects: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/subjects`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const data = await res.json();

      if (!data.success) {
        return {
          data: null,
          error: data.error,
        };
      }

      return { data: data.data, error: null };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: error,
      };
    }
  },
};
