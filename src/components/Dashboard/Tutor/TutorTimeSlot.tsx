"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Calendar, Plus, Trash2, Loader2, Lock } from "lucide-react";
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
      const start = data.startTime.split(":").map(Number);
      const end = data.endTime.split(":").map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      return startMinutes < endMinutes;
    },
    { message: "End time must be after start time", path: ["endTime"] },
  );

export function TutorTimeSlot({ tutorProfile, isLocked }: StepProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const [slots, setSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      date: "2024-02-25",
      startTime: "10:00",
      endTime: "11:00",
      isBooked: false,
    },
    {
      id: "2",
      date: "2024-02-25",
      startTime: "14:00",
      endTime: "15:00",
      isBooked: false,
    },
    {
      id: "3",
      date: "2024-02-26",
      startTime: "11:00",
      endTime: "12:00",
      isBooked: true,
    },
  ]);

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
      setIsPending(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newSlot = {
          ...value,
          id: Date.now().toString(),
          isBooked: false,
        } as TimeSlot;
        setSlots((prev) => [...prev, newSlot]);
        setIsAdding(false);
        form.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create slot");
      } finally {
        setIsPending(false);
      }
    },
  });

  const handleDelete = async (id: string) => {
    setIsPending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSlots((prev) => prev.filter((slot) => slot.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slot");
    } finally {
      setIsPending(false);
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
    (acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);
      return acc;
    },
    {} as Record<string, TimeSlot[]>,
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

        {/* Slots by Date */}
        <div className="space-y-4">
          {Object.entries(groupedSlots).map(([date, dateSlots]) => (
            <div key={date}>
              <h4 className="font-medium mb-2">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
              <div className="space-y-2">
                {dateSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <Badge variant={slot.isBooked ? "secondary" : "outline"}>
                        {slot.isBooked ? "Booked" : "Available"}
                      </Badge>
                    </div>
                    {!slot.isBooked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(slot.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Slot Form */}
        {isAdding && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="mt-4 p-4 border border-dashed rounded-lg space-y-4"
          >
            <h4 className="font-medium">Create New Time Slot</h4>

            <div className="grid grid-cols-3 gap-4">
              <form.Field
                name="date"
                children={(field) => (
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
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
                name="startTime"
                children={(field) => (
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="10:00"
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
                      placeholder="11:00"
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
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit]}
                children={([canSubmit]) => (
                  <Button type="submit" disabled={!canSubmit || isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Slot"
                    )}
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
            Create Time Slot
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
