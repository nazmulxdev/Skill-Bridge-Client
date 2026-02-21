import { env } from "@/env";

// Simple fetch wrapper
async function clientFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${env.API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Request failed");
  }

  return data.data;
}

export const tutorClientService = {
  // Get tutor profile
  getTutorProfile: () => clientFetch<any>("/tutors/me", { method: "GET" }),

  // Create tutor profile
  createTutorProfile: (data: { hourlyRate: number }) =>
    clientFetch<any>("/tutors", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update hourly rate
  updateHourlyRate: (data: { hourlyRate: number }) =>
    clientFetch<any>("/tutors/update/hourly_rate", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Subjects
  addSubjects: (subjectIds: string[]) =>
    clientFetch<any>("/tutors/subjects", {
      method: "POST",
      body: JSON.stringify({
        subjects: subjectIds.map((id) => ({ subjectId: id })),
      }),
    }),

  removeSubject: (subjectId: string) =>
    clientFetch<any>(`/tutors/subjects/${subjectId}`, {
      method: "DELETE",
    }),

  // Education
  addEducation: (data: any) =>
    clientFetch<any>("/tutors/education", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEducation: (id: string, data: any) =>
    clientFetch<any>(`/tutors/education/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteEducation: (id: string) =>
    clientFetch<any>(`/tutors/education/${id}`, {
      method: "DELETE",
    }),

  // Availability
  addAvailability: (data: any) =>
    clientFetch<any>("/tutors/availabilities", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateAvailability: (id: string, data: any) =>
    clientFetch<any>(`/tutors/availabilities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteAvailability: (id: string) =>
    clientFetch<any>(`/tutors/availabilities/${id}`, {
      method: "DELETE",
    }),

  // Time Slots
  createTimeSlot: (data: any) =>
    clientFetch<any>("/tutors/time-slot", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTimeSlot: (id: string, data: any) =>
    clientFetch<any>(`/tutors/time-slot/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteTimeSlot: (id: string) =>
    clientFetch<any>(`/tutors/time-slot/${id}`, {
      method: "DELETE",
    }),

  // Get all subjects (for dropdown)
  getAllSubjects: () => clientFetch<any[]>("/subjects", { method: "GET" }),
};
