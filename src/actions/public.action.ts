"use server";

import { IPublicParams, publicService } from "@/services/public.service";

export const getAllPublicTutor = async (params: IPublicParams) => {
  return await publicService.getAllTutors(params);
};

export const getTutorById = async (tutorId: string) => {
  return await publicService.getTutorById(tutorId);
};
