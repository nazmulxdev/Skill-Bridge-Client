import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const authClientService = {
  signOut: async function () {
    const toastId = toast.loading("Logging out...");

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully", { id: toastId });
            window.location.href = "/";
          },
          onError: (error) => {
            console.error(error);
            toast.error("Failed to sign out", { id: toastId });
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Something went wrong", { id: toastId });
    }
  },
};
