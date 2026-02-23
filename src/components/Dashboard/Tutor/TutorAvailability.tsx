"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Clock, Plus, Pencil, Trash2, Lock } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Availability, StepProps } from "@/types";
import {
  addTutorAvailabilities,
  removeTutorAvailabilities,
  updateTutorAvailabilities,
} from "@/actions/tutor.action";
import { toast } from "sonner";

// Schema
const formSchema = z
  .object({
    dayOfWeek: z.string().min(1, "Day is required"),
    startTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM)",
      ),
    endTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM)",
      ),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return false;
      const start = data.startTime.split(":").map(Number);
      const end = data.endTime.split(":").map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      return startMinutes < endMinutes;
    },
    { message: "End time must be after start time", path: ["endTime"] },
  );

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

// Helper to format error message
const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";

  // Handle the [object Object] case
  if (typeof error === "object" && error !== null) {
    if (error.message) return error.message;
    if (error.error?.message) return error.error.message;

    // Try to stringify nicely, but avoid [object Object]
    try {
      const str = JSON.stringify(error);
      if (str && str !== "{}" && !str.includes("[object")) {
        return str;
      }
    } catch {
      // Ignore stringify errors
    }
  }

  if (typeof error === "string") {
    // Check if it's the dreaded [object Object]
    if (error.includes("[object Object]")) {
      return "Operation failed. Please try again.";
    }
    return error;
  }

  return "Something went wrong. Please try again.";
};

export function TutorAvailability({ tutorProfile, isLocked }: StepProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const availabilityList = tutorProfile?.availabilities || [];

  const form = useForm({
    defaultValues: {
      dayOfWeek: "",
      startTime: "",
      endTime: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading(
        editingId ? "Updating availability..." : "Adding availability...",
      );
      setError(null);

      try {
        if (editingId) {
          const res = await updateTutorAvailabilities({
            id: editingId,
            ...value,
          });
          if (!res.data || res.error) {
            throw new Error(res.error?.message || "Failed to add subject");
          }
        } else {
          const res = await addTutorAvailabilities(value);
          if (!res.data || res.error) {
            throw new Error(res.error?.message || "Failed to add subject");
          }
        }
        toast.success(
          editingId
            ? "Availability updated successfully!"
            : "Availability added successfully!",
          {
            id: toastId,
          },
        );
        setIsAdding(false);
        setEditingId(null);
        form.reset();
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      }
    },
  });

  const handleEdit = (av: Availability) => {
    setEditingId(av.id);
    setIsAdding(true);
    form.setFieldValue("dayOfWeek", av.dayOfWeek);
    form.setFieldValue("startTime", av.startTime);
    form.setFieldValue("endTime", av.endTime);
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Removing availability...");
    setError(null);
    try {
      const res = await removeTutorAvailabilities(id);

      if (!res.data || res.error) {
        const errorMessage = getErrorMessage(res.error);
        throw new Error(errorMessage || "Failed to delete");
      }

      toast.success("Availability removed successfully!", { id: toastId });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    }
  };

  if (isLocked) {
    return (
      <Card className="border-border/50 bg-card/50 opacity-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg text-muted-foreground">
              Step 4: Availability
            </CardTitle>
          </div>
          <CardDescription>Complete Step 3 to unlock</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Step 4: Weekly Availability</CardTitle>
        </div>
        <CardDescription>Set your regular weekly schedule</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Availability List - Using database data */}
        <div className="space-y-2">
          {availabilityList.length > 0 ? (
            availabilityList.map((av: Availability) => (
              <div
                key={av.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div>
                  <span className="font-medium">{av.dayOfWeek}</span>
                  <span className="text-muted-foreground ml-4">
                    {av.startTime} - {av.endTime}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(av)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(av.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No availability set. Add your weekly schedule below.
            </p>
          )}
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="mt-4 p-4 border border-dashed rounded-lg space-y-4"
          >
            <h4 className="font-medium">
              {editingId ? "Edit Availability" : "Add New Availability"}
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <form.Field
                name="dayOfWeek"
                children={(field) => (
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors && (
                      <p className="text-xs text-destructive">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="startTime"
                children={(field) => (
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="09:00"
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs text-destructive">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="endTime"
                children={(field) => (
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="17:00"
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs text-destructive">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                }}
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit]}
                children={([canSubmit]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    {editingId ? "Update" : "Add"}
                  </Button>
                )}
              />
            </div>
          </form>
        )}

        {!isAdding && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Availability
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
