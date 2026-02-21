"use client";

import { useState } from "react";

import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TutorHourlyRate } from "./HourlyRate";
import { TutorEducation } from "./TutorEducation";
import { TutorSubject } from "./TutorSubject";
import { TutorAvailability } from "./TutorAvailability";
import { TutorTimeSlot } from "./TutorTimeSlot";

interface TutorSetupProps {
  userData: any;
  tutorProfile: any | null;
}

export function TutorSetup({ userData, tutorProfile }: TutorSetupProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>(
    tutorProfile ? [1] : [],
  );

  const hasProfile = tutorProfile !== null;

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Complete Your Tutor Profile</h1>
        <p className="text-muted-foreground">
          Set up your profile step by step to start teaching
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3, 4, 5].map((step) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent =
            step === 1 || (step > 1 && completedSteps.includes(step - 1));

          return (
            <div key={step} className="flex-1 relative">
              {/* Connector Line */}
              {step < 5 && (
                <div
                  className={cn(
                    "absolute top-4 left-1/2 w-full h-0.5",
                    completedSteps.includes(step) ? "bg-primary" : "bg-border",
                  )}
                />
              )}

              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 bg-background z-10",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border",
                    isCurrent && !isCompleted && "border-primary",
                  )}
                >
                  {isCompleted ? (
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
                <span className="text-xs mt-2">Step {step}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Steps */}
      <div className="space-y-6">
        <TutorHourlyRate
          userData={userData}
          tutorProfile={tutorProfile}
          onComplete={() => handleStepComplete(1)}
        />

        <TutorEducation tutorProfile={tutorProfile} isLocked={!hasProfile} />

        <TutorSubject tutorProfile={tutorProfile} isLocked={!hasProfile} />

        <TutorAvailability tutorProfile={tutorProfile} isLocked={!hasProfile} />

        <TutorTimeSlot tutorProfile={tutorProfile} isLocked={!hasProfile} />
      </div>
    </div>
  );
}
