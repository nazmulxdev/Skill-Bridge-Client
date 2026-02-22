import { env } from "@/env";
import { Education } from "@/types";
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
        next: {
          tags: [
            "create-tutor",
            "update-tutor",
            "add-education",
            "update-education",
            "delete-education",
          ],
        },
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

  // create tutor profile using

  createTutorProfileUsingRate: async function (hourlyRate: number) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/tutors/`, {
        method: "POST",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ hourlyRate }),
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

  // update tutor profile using hourly rate

  updateTutorHourlyRate: async function (hourlyRate: number) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/tutors/update/hourly_rate`, {
        method: "PATCH",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ hourlyRate }),
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

  // create education

  createEducation: async function (payload: Partial<Education>) {},
};
