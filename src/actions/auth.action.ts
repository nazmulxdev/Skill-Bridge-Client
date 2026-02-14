"use server";

import { authService } from "@/services/authService";

export const getAuthSession = async () => {
  return await authService.getSession();
};
