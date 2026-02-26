"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Calendar, Plus, Trash2, Lock, Pencil } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StepProps, TimeSlot } from "@/types";
import {
  addTutorTimeSlot,
  deleteTutorTimeSlot,
  updateTutorTimeSlot,
} from "@/actions/tutor.action";
import { toast } from "sonner";
import { FieldError } from "@/components/ui/field";

// Schema
const formSchema = z
  .object({
    date: z.string().min(1, "Date is required"),
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

// Helper to format error message
const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";

  if (typeof error === "object" && error !== null) {
    if (error.message) return error.message;
    if (error.error?.message) return error.error.message;
    return "Operation failed. Please try again.";
  }

  if (typeof error === "string") {
    if (error.includes("[object Object]")) {
      return "Operation failed. Please try again.";
    }
    return error;
  }

  return "Something went wrong. Please try again.";
};

// Format date for display
const formatDisplayDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function TutorTimeSlot({ tutorProfile, isLocked }: StepProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Data directly from database - NO LOCAL STATE
  const slots = tutorProfile?.tutorTimeSlots || [];

  const form = useForm({
    defaultValues: {
      date: "",
      startTime: "",
      endTime: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading(
        editingId ? "Updating time slot..." : "Creating time slot...",
      );
      setError(null);

      try {
        let res;

        if (editingId) {
          res = await updateTutorTimeSlot({
            id: editingId,
            ...value,
          });
        } else {
          res = await addTutorTimeSlot(value);
        }

        if (!res.data || res.error) {
          throw new Error(
            res.error?.message ||
              (editingId ? "Failed to update" : "Failed to create"),
          );
        }

        toast.success(
          editingId
            ? "Time slot updated successfully!"
            : "Time slot created successfully!",
          { id: toastId },
        );

        // Reset form and close
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

  const handleEdit = (slot: TimeSlot) => {
    setEditingId(slot.id);
    setIsAdding(true);
    // Set form values directly from the slot object
    form.setFieldValue("date", slot.date.split("T")[0]); // Handle date format
    form.setFieldValue("startTime", slot.startTime);
    form.setFieldValue("endTime", slot.endTime);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    form.reset(); // Reset form to empty values
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Removing time slot...");
    setError(null);

    try {
      const res = await deleteTutorTimeSlot(id);

      if (!res.data || res.error) {
        const errorMessage = getErrorMessage(res.error);
        throw new Error(errorMessage || "Failed to delete");
      }

      toast.success("Time slot removed successfully!", { id: toastId });
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
              Step 5: Time Slots
            </CardTitle>
          </div>
          <CardDescription>Complete Step 4 to unlock</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Group slots by date
  const groupedSlots = slots.reduce(
    (acc: Record<string, TimeSlot[]>, slot: TimeSlot) => {
      const dateKey = slot.date.split("T")[0]; // Normalize date key
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(slot);
      return acc;
    },
    {},
  );

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Step 5: Time Slots</CardTitle>
        </div>
        <CardDescription>
          Create available time slots for students to book
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Slots by Date - Direct from database */}
        <div className="space-y-4">
          {Object.entries(groupedSlots).length > 0 ? (
            Object.entries(groupedSlots).map(([date, dateSlots]) => {
              const typedSlots = dateSlots as TimeSlot[];
              return (
                <div key={date}>
                  <h4 className="font-medium mb-2">
                    {formatDisplayDate(date)}
                  </h4>
                  <div className="space-y-2">
                    {typedSlots.map((slot: TimeSlot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <Badge
                            variant={slot.isBooked ? "secondary" : "outline"}
                          >
                            {slot.isBooked ? "Booked" : "Available"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          {!slot.isBooked && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(slot)}
                                disabled={isAdding}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(slot.id)}
                                disabled={isAdding}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No time slots created yet. Create your first time slot below.
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
              {editingId ? "Edit Time Slot" : "Create New Time Slot"}
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <form.Field
                name="date"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </div>
                  );
                }}
              />

              <form.Field
                name="startTime"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="10:00"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </div>
                  );
                }}
              />

              <form.Field
                name="endTime"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="11:00"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </div>
                  );
                }}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit]}
                children={([canSubmit]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    {editingId ? "Update" : "Create"}
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
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              form.reset();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Time Slot
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
