// src/components/Dashboard/Tutor/TutorBasicProfile.tsx
"use client";

import { useState } from "react";
import { AlertTriangle, Edit, Save, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface UserDetailsProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
    tutorProfiles?: any | null;
  };
}

export function TutorBasicProfile({ user }: UserDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
  });

  const isTutor = user.role === "TUTOR";

  const tutorProfile = user.tutorProfiles;
  const hasProfile = user.tutorProfiles !== null;

  // checking steps
  const isStep1Complete = hasProfile && tutorProfile?.hourlyRate != null;
  const isStep2Complete = (tutorProfile?.education?.length || 0) > 0;
  const isStep3Complete = (tutorProfile?.subjects?.length || 0) > 0;
  const isStep4Complete = (tutorProfile?.availabilities?.length || 0) > 0;
  const isStep5Complete = (tutorProfile?.tutorTimeSlots?.length || 0) > 0;

  // Determine which step is currently active
  const getCurrentStep = () => {
    if (!isStep1Complete) return 1;
    if (!isStep2Complete) return 2;
    if (!isStep3Complete) return 3;
    if (!isStep4Complete) return 4;
    if (!isStep5Complete) return 5;
    return 5; // All complete
  };

  const currentStep = getCurrentStep();
  const hasCompletedProfile = isTutor && currentStep === 5;

  const handleSaveName = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSaving(true);
    try {
      await authClient.updateUser({
        name: formData.name,
      });

      toast.success("Name updated successfully");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update name:", error);
      toast.error("Failed to update name. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.name || "",
    });
    setIsEditing(false);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Base profile card component to avoid duplication
  const ProfileCard = ({ children }: { children?: React.ReactNode }) => (
    <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="text-xl bg-primary/10">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="tutor-name">Full Name</Label>
                  <Input
                    id="tutor-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    className="bg-background"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveName}
                    disabled={isSaving}
                    size="sm"
                    className="gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    size="sm"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 hover:bg-primary/10"
                    title="Edit name"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {user.role}
                  </span>
                  {isTutor && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Step {currentStep}/5
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );

  // If not a tutor, show basic profile without step info
  if (!isTutor) {
    return <ProfileCard />;
  }

  // If tutor with incomplete profile, show warning
  if (!hasCompletedProfile) {
    return (
      <ProfileCard>
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Complete Your Tutor Profile
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm mb-3">
              You need to complete your tutor profile before you can start
              teaching. Set up your hourly rate, education, subjects, and
              availability to get started.
            </p>
            <div className="text-sm">
              <p className="font-medium">Progress: Step {currentStep} of 5</p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </ProfileCard>
    );
  }

  // If tutor with complete profile, show basic profile
  return <ProfileCard />;
}
