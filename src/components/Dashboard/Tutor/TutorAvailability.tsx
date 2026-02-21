"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Clock, Plus, Pencil, Trash2, Loader2, Lock } from "lucide-react";
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

export function TutorAvailability({ tutorProfile, isLocked }: StepProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const [availabilityList, setAvailabilityList] = useState<Availability[]>([
    { id: "1", dayOfWeek: "MONDAY", startTime: "09:00", endTime: "17:00" },
    { id: "2", dayOfWeek: "WEDNESDAY", startTime: "10:00", endTime: "18:00" },
    { id: "3", dayOfWeek: "FRIDAY", startTime: "09:00", endTime: "15:00" },
  ]);

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
      setIsPending(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (editingId) {
          setAvailabilityList((prev) =>
            prev.map((av) =>
              av.id === editingId
                ? ({ ...value, id: editingId } as Availability)
                : av,
            ),
          );
        } else {
          const newAv = { ...value, id: Date.now().toString() } as Availability;
          setAvailabilityList((prev) => [...prev, newAv]);
        }

        setIsAdding(false);
        setEditingId(null);
        form.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save");
      } finally {
        setIsPending(false);
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
    setIsPending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAvailabilityList((prev) => prev.filter((av) => av.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
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

        {/* Availability List */}
        <div className="space-y-2">
          {availabilityList.map((av) => (
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
                  disabled={isPending}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(av.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
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
                  setEditingId(null);
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
                        Saving...
                      </>
                    ) : editingId ? (
                      "Update"
                    ) : (
                      "Add"
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
            Add Availability
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
