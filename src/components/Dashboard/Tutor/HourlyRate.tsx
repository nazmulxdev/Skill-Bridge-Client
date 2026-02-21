"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { DollarSign, Edit2, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { StepProps } from "@/types";

// Schema
const formSchema = z.object({
  hourlyRate: z
    .number()
    .min(1, "Hourly rate is required")
    .positive("Must be positive"),
});

export function TutorHourlyRate({
  userData,
  tutorProfile,
  onComplete,
}: StepProps) {
  const [isEditing, setIsEditing] = useState(!tutorProfile);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const hasProfile = tutorProfile !== null;

  const form = useForm({
    defaultValues: {
      hourlyRate: tutorProfile?.hourlyRate || ("" as unknown as number),
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      setError(null);

      try {
        if (hasProfile) {
          const res = await fetch("/api/tutor/update/hourly_rate", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
        } else {
          const res = await fetch("/api/tutor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
        }

        setIsEditing(false);
        if (onComplete) onComplete();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsPending(false);
      }
    },
  });

  return (
    <Card
      className={`border-border/50 ${!hasProfile ? "border-2 border-primary/20" : ""}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Step 1: Hourly Rate</CardTitle>
              <CardDescription>Set your base teaching rate</CardDescription>
            </div>
          </div>
          {hasProfile && (
            <Badge variant="outline" className="bg-success/10 text-success">
              <CheckCircle className="h-3 w-3 mr-1" /> Completed
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isEditing && hasProfile ? (
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <span className="text-2xl font-bold text-primary">
                ${tutorProfile.hourlyRate}
              </span>
              <span className="text-muted-foreground ml-1">/hour</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Update Rate
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="hourlyRate"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Hourly Rate ($)</Label>
                  <Input
                    id={field.name}
                    type="number"
                    value={field.state.value === 0 ? "" : field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="45"
                    min="1"
                    step="0.01"
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="flex gap-2">
              {hasProfile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
              <form.Subscribe
                selector={(state) => [state.canSubmit]}
                children={([canSubmit]) => (
                  <Button type="submit" disabled={!canSubmit || isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {hasProfile ? "Updating..." : "Creating..."}
                      </>
                    ) : hasProfile ? (
                      "Update Rate"
                    ) : (
                      "Create Profile"
                    )}
                  </Button>
                )}
              />
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
