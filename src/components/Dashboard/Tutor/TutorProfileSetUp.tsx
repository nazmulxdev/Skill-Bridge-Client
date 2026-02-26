"use client";

import { TutorEducation } from "./TutorEducation";
import { TutorSubject } from "./TutorSubject";
import { TutorAvailability } from "./TutorAvailability";
import { TutorTimeSlot } from "./TutorTimeSlot";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TutorHourlyRate } from "./HourlyRate";

interface TutorSetupProps {
  userData: any;
  tutorProfile: any | null;
}

export function TutorSetup({ tutorProfile }: TutorSetupProps) {
  const hasProfile = tutorProfile !== null;

  // checking steps
  const isStep1Complete = hasProfile && tutorProfile?.hourlyRate != null;
  const isStep2Complete = (tutorProfile?.education?.length || 0) > 0;
  const isStep3Complete = (tutorProfile?.subjects?.length || 0) > 0;
  const isStep4Complete = (tutorProfile?.availabilities?.length || 0) > 0;
  const isStep5Complete = (tutorProfile?.tutorTimeSlots?.length || 0) > 0;

  // Lock steps based on previous steps being complete
  const isStep2Locked = !isStep1Complete;
  const isStep3Locked = !isStep2Complete;
  const isStep4Locked = !isStep3Complete;
  const isStep5Locked = !isStep4Complete;

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

  const handleStepComplete = () => {
    // This will trigger a revalidation through server actions
    // The page will refresh with new data from database
  };

  return (
    <div className="max-w-full mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Complete Your Tutor Profile</h1>
        <p className="text-muted-foreground">
          Set up your profile step by step to start teaching
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {[
          { step: 1, label: "Hourly Rate", complete: isStep1Complete },
          { step: 2, label: "Education", complete: isStep2Complete },
          { step: 3, label: "Subjects", complete: isStep3Complete },
          { step: 4, label: "Availability", complete: isStep4Complete },
          { step: 5, label: "Time Slots", complete: isStep5Complete },
        ].map(({ step, label, complete }) => {
          const isCurrent = currentStep === step;

          return (
            <div key={step} className="flex-1 relative">
              {/* Connector Line */}
              {step < 5 && (
                <div
                  className={cn(
                    "absolute top-4 left-1/2 w-full h-0.5",
                    complete ? "bg-primary" : "bg-border",
                  )}
                />
              )}

              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 bg-background z-10",
                    complete
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border",
                    isCurrent && !complete && "border-primary",
                  )}
                >
                  {complete ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <span
                      className={cn(
                        "text-sm",
                        isCurrent ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {step}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-2">{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Steps */}
      <div className="space-y-6">
        <TutorHourlyRate
          tutorProfile={tutorProfile}
          onComplete={handleStepComplete}
        />

        <TutorEducation tutorProfile={tutorProfile} isLocked={isStep2Locked} />

        <TutorSubject tutorProfile={tutorProfile} isLocked={isStep3Locked} />

        <TutorAvailability
          tutorProfile={tutorProfile}
          isLocked={isStep4Locked}
        />

        <TutorTimeSlot tutorProfile={tutorProfile} isLocked={isStep5Locked} />
      </div>
    </div>
  );
}
