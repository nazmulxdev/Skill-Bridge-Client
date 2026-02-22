"use server";

import { tutorService } from "@/services/tutor.service.server";
import { Education } from "@/types";
import { revalidateTag } from "next/cache";

export const createTutorWithServer = async (hourlyRate: number) => {
  const result = await tutorService.createTutorProfileUsingRate(hourlyRate);

  if (result.data) {
    revalidateTag("tutor-profile", "max");
  }

  return result;
};

export const updateTutorHourlyRate = async (hourlyRate: number) => {
  const result = await tutorService.updateTutorHourlyRate(hourlyRate);

  if (result.data) {
    revalidateTag("tutor-profile", "max");
  }

  return result;
};

// add tutor education
export const addTutorEducation = async (payload: Partial<Education>) => {
  const result = await tutorService.createEducation(payload);

  if (result.data) {
    revalidateTag("tutor-profile", "max");
  }

  return result;
};

// update tutor education
export const updateTutorEducation = async (payload: Partial<Education>) => {
  const result = await tutorService.createEducation(payload);

  if (result.data) {
    revalidateTag("tutor-profile", "max");
  }

  return result;
};

// delete tutor education
export const deleteTutorEducation = async (id: string) => {
  const result = await tutorService.deleteEducation(id);

  if (result.data) {
    revalidateTag("tutor-profile", "max");
  }

  return result;
};
