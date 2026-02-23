import { env } from "@/env";
import { Availability, Education } from "@/types";
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
          tags: ["tutor-profile"],
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

  // get all category with subject
  getAllSubjectWithCategory: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/categories`, {
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

  createEducation: async function (payload: Partial<Education>) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/tutors/education`, {
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

  // update education
  updateEducation: async function (payload: Partial<Education>) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/tutors/education/${payload.id}`, {
        method: "PATCH",
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

  // delete education

  deleteEducation: async function (id: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/tutors/education/${id}`, {
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

  // adding subject

  addingTutorSubjects: async function (subjectIds: string[]) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/tutors/subjects`, {
        method: "POST",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          subjects: subjectIds.map((id) => ({ subjectId: id })),
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

  // deleting subject

  removeTutorSubject: async function (subjectId: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/tutors/subjects/${subjectId}`, {
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

  // adding tutor availability
  addTutorAvailabilities: async function (payload: Partial<Availability>) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/tutors/availabilities`, {
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

  // update tutor availability

  updateTutorAvailability: async function (payload: Partial<Availability>) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(
        `${env.API_URL}/tutors/availabilities/${payload.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: cookieStore.toString(),
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify(payload),
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

  // delete tutor availability

  deleteTutorAvailabilities: async function (id: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/tutors/availabilities/${id}`, {
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
};
