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
