import { env } from "@/env";
import { cookies } from "next/headers";

const authUrl = env.AUTH_URL;
export const authService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${authUrl}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();
      if (!data) {
        return {
          data: null,
          error: {
            message: "Session is missing",
          },
        };
      }
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Something went wrong to get session.",
        },
      };
    }
  },
  getCurrentUser: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${authUrl}/me`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: "Failed to fetch user.",
          },
        };
      }
      const data = await res.json();
      if (!data) {
        return {
          data: null,
          error: {
            message: "User not found.",
          },
        };
      }
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching current user:", error);
      return {
        data: null,
        error: {
          message: "Something went wrong fetching user data.",
        },
      };
    }
  },
};
