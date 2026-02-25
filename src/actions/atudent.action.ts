"use server";

import { studentServices } from "@/services/student.service";
import { revalidateTag } from "next/cache";

export const getStudentProfile = async () => {
  return await studentServices.getStudentProfile();
};

export const bookingTimeSlot = async (payload: {
  timeSlotId: string;
  subjectId: string;
}) => {
  const result = await studentServices.bookingSlot(payload);
  if (result.data) {
    revalidateTag("student-profile", "max");
    revalidateTag("public-tutors", "max");
    revalidateTag("tutor-by-id", "max");
  }
  return result;
};

export const cancelBooking = async (bookingId: string) => {
  const result = await studentServices.cancelBookedSlot(bookingId);
  if (result.data) {
    revalidateTag("student-profile", "max");
    revalidateTag("public-tutors", "max");
    revalidateTag("tutor-by-id", "max");
  }
  return result;
};

export const makeSessionReview = async (payload: {
  bookingId: string;
  rating: number;
  comment: string;
}) => {
  const result = await studentServices.makeReview(payload);
  if (result.data) {
    revalidateTag("student-profile", "max");
    revalidateTag("public-tutors", "max");
    revalidateTag("tutor-by-id", "max");
  }
  return result;
};
