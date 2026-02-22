"use server";

import { tutorService } from "@/services/tutor.service.server";
import { revalidateTag } from "next/cache";

export const createTutorWithServer = async (hourlyRate: number) => {
  const result = await tutorService.createTutorProfileUsingRate(hourlyRate);

  if (result.data) {
    revalidateTag("create-tutor", "max");
  }

  return result;
};

export const updateTutorHourlyRate = async (hourlyRate: number) => {
  const result = await tutorService.updateTutorHourlyRate(hourlyRate);

  if (result.data) {
    revalidateTag("update-tutor", "max");
  }

  return result;
};
