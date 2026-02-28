import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "https://skill-bridge-frontend-v3.vercel.app",
});
