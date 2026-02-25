import { env } from "@/env";
import { cookies } from "next/headers";

enum Status {
  BANNED,
  UNBANNED,
}

export const adminService = {
  // get all category

  getAllCategory: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/categories/`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
        next: {
          tags: ["categories"],
        },
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

  //   create category

  createCategory: async function (payload: {
    name: string;
    description: string;
  }) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/categories/`, {
        method: "POST",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
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

  //   update category

  updateCategory: async function (payload: {
    categoryId: string;
    name?: string;
    description?: string;
  }) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(
        `${env.API_URL}/categories/${payload.categoryId}`,
        {
          method: "PATCH",
          headers: {
            Cookie: cookieStore.toString(),
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({
            name: payload.name,
            description: payload.description,
          }),
        },
      );
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

  //   delete category

  deleteCategory: async function (categoryId: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/categories/${categoryId}`, {
        method: "DELETE",
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
  // get all subjects

  getAllSubjects: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/subjects/`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
        next: {
          tags: ["subjects"],
        },
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

  //   add subjects

  addSubject: async function (payload: { name: string; categoryId: string }) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/subjects/${payload.categoryId}`, {
        method: "POST",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ name: payload.name }),
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

  //   update category

  updateSubject: async function (payload: {
    categoryId: string;
    name: string;
  }) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/subjects/${payload.categoryId}`, {
        method: "PATCH",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          name: payload.name,
        }),
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

  //   delete category

  deleteSubject: async function (subjectId: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/subjects/${subjectId}`, {
        method: "DELETE",
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

  //   banned unbanned users

  manageUser: async function (payload: { userId: string; status: Status }) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/admin/users/${payload.userId}`, {
        method: "PATCH",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ status: payload.status }),
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

  //   making featured true or false

  manageTutor: async function (payload: {
    tutorId: string;
    isFeatured: boolean;
  }) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(
        `${env.API_URL}/admin/tutors/${payload.tutorId}/featured`,
        {
          method: "PATCH",
          headers: {
            Cookie: cookieStore.toString(),
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({ isFeatured: payload.isFeatured }),
        },
      );
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
