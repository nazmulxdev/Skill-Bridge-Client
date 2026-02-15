// components/NavBar/SignOutButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClientService } from "@/services/authService.client";

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await authClientService.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <Button onClick={handleSignOut} disabled={isSigningOut}>
      {isSigningOut ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
