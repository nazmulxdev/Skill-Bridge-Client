"use server";

import { tutorService } from "@/services/tutor.service.server";
import { Availability, Education } from "@/types";
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
  const result = await tutorService.updateEducation(payload);

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

// get category with subject

export const getAllCategoryWithSubject = async () => {
  return await tutorService.getAllSubjectWithCategory();
};

// add tutor subject

export const addTutorSubjects = async (subjectIds: string[]) => {
  const result = await tutorService.addingTutorSubjects(subjectIds);
  if (result.data) {
    revalidateTag("tutor-profile", "max");
  }

  return result;
};

// removing tutor subject

export const removeTutorSubject = async (subjectId: string) => {
  const result = await tutorService.removeTutorSubject(subjectId);
  if (result.data) {
    revalidateTag("tutor-profile", "max");
  }
  return result;
};

// add tutor availability

export const addTutorAvailabilities = async (
  payload: Partial<Availability>,
) => {
  const result = await tutorService.addTutorAvailabilities(payload);
  if (result.data) {
    revalidateTag("tutor-profile", "max");
  }

  return result;
};

// update tutor availabilities
export const updateTutorAvailabilities = async (
  payload: Partial<Availability>,
) => {
  const result = await tutorService.updateTutorAvailability(payload);

  if (result.data) {
    revalidateTag("tutor-profile", "max");
  }

  return result;
};

// removing tutor subject

export const removeTutorAvailabilities = async (id: string) => {
  const result = await tutorService.deleteTutorAvailabilities(id);
  if (result.data) {
    revalidateTag("tutor-profile", "max");
  }
  return result;
};
