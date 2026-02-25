"use server";

import { studentServices } from "@/services/student.service";

export const getStudentProfile = async () => {
  return await studentServices.getStudentProfile();
};
