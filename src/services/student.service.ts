import { cookies } from "next/headers";
import { env } from "process";

export const studentServices = {
  // get student profile
  getStudentProfile: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${env.API_URL}/students/me`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
        next: {
          tags: ["student-profile"],
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
};
