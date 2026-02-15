"use server";

import { authService } from "@/services/authService.server";

export const getAuthSession = async () => {
  return await authService.getSession();
};
