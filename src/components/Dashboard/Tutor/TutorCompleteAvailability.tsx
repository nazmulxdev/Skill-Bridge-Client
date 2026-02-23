"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import {
  Clock,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Availability } from "@/types";
import {
  addTutorAvailabilities,
  removeTutorAvailabilities,
  updateTutorAvailabilities,
} from "@/actions/tutor.action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  { value: "MONDAY", label: "Monday", short: "Mon" },
  { value: "TUESDAY", label: "Tuesday", short: "Tue" },
  { value: "WEDNESDAY", label: "Wednesday", short: "Wed" },
  { value: "THURSDAY", label: "Thursday", short: "Thu" },
  { value: "FRIDAY", label: "Friday", short: "Fri" },
  { value: "SATURDAY", label: "Saturday", short: "Sat" },
  { value: "SUNDAY", label: "Sunday", short: "Sun" },
];

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

// Day color mapping
const getDayColor = (day: string) => {
  const colors: Record<string, string> = {
    MONDAY: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    TUESDAY: "bg-green-500/10 text-green-600 border-green-500/20",
    WEDNESDAY: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    THURSDAY: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    FRIDAY: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    SATURDAY: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    SUNDAY: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };
  return colors[day] || "bg-muted/30 text-muted-foreground";
};

interface TutorCompleteAvailabilityProps {
  tutorProfile: any;
}

export function TutorCompleteAvailability({
  tutorProfile,
}: TutorCompleteAvailabilityProps) {
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
            throw new Error(res.error?.message || "Failed to update");
          }
        } else {
          const res = await addTutorAvailabilities(value);
          if (!res.data || res.error) {
            throw new Error(res.error?.message || "Failed to add");
          }
        }
        toast.success(
          editingId
            ? "Availability updated successfully!"
            : "Availability added successfully!",
          { id: toastId },
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
        throw new Error(res.error?.message || "Failed to delete");
      }
      toast.success("Availability removed successfully!", { id: toastId });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    form.reset();
  };

  // Sort availability by day order
  const sortedAvailability = [...availabilityList].sort((a, b) => {
    const dayOrder = DAYS.map((d) => d.value);
    return dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
  });

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Weekly Availability</h1>
          <p className="text-muted-foreground">
            Set your regular weekly teaching schedule
          </p>
        </div>
      </div>

      <Card className="border-border/50 bg-gradient-to-br from-card/50 to-background overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-transparent pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 ring-2 ring-primary/20">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Manage Your Availability
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-0.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Add, edit or remove your weekly teaching slots</span>
                </CardDescription>
              </div>
            </div>
            {!isAdding && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20"
              >
                {availabilityList.length}{" "}
                {availabilityList.length === 1 ? "Slot" : "Slots"}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert variant="destructive" className="border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Availability Grid */}
          <AnimatePresence mode="popLayout">
            {sortedAvailability.length > 0 ? (
              <motion.div layout className="grid gap-3">
                {sortedAvailability.map((av: Availability, index) => (
                  <motion.div
                    key={av.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group relative flex items-center justify-between p-4 rounded-xl",
                      "border border-border/50 hover:border-primary/30",
                      "bg-gradient-to-r from-muted/30 to-transparent",
                      "transition-all duration-300 hover:shadow-md",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "px-3 py-1.5 rounded-lg font-medium text-sm",
                          getDayColor(av.dayOfWeek),
                        )}
                      >
                        {DAYS.find((d) => d.value === av.dayOfWeek)?.short ||
                          av.dayOfWeek}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-background/50">
                          {av.startTime}
                        </Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="outline" className="bg-background/50">
                          {av.endTime}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(av)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(av.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-border/50 rounded-xl bg-muted/10"
              >
                <Clock className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">
                  No availability set
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Add your weekly schedule to start receiving bookings
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Separator className="bg-border/50" />

          {/* Add/Edit Form */}
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-xl border border-primary/20"
              >
                <h4 className="font-medium flex items-center gap-2 mb-4">
                  {editingId ? (
                    <>
                      <Pencil className="h-4 w-4 text-primary" />
                      Edit Availability Slot
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 text-primary" />
                      Add New Availability Slot
                    </>
                  )}
                </h4>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <form.Field
                      name="dayOfWeek"
                      children={(field) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Day</Label>
                          <Select
                            value={field.state.value}
                            onValueChange={field.handleChange}
                          >
                            <SelectTrigger className="bg-background/50 border-border/50">
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS.map((day) => (
                                <SelectItem key={day.value} value={day.value}>
                                  {day.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.state.meta.errors && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
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
                          <Label className="text-sm font-medium">
                            Start Time
                          </Label>
                          <Input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="09:00"
                            className="bg-background/50 border-border/50"
                          />
                          {field.state.meta.errors && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
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
                          <Label className="text-sm font-medium">
                            End Time
                          </Label>
                          <Input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="17:00"
                            className="bg-background/50 border-border/50"
                          />
                          {field.state.meta.errors && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {field.state.meta.errors.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-border/50 hover:bg-muted"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <form.Subscribe
                      selector={(state) => [state.canSubmit]}
                      children={([canSubmit]) => (
                        <Button
                          type="submit"
                          disabled={!canSubmit}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {editingId ? "Update" : "Add"}
                        </Button>
                      )}
                    />
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-12 border-dashed border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                  onClick={() => setIsAdding(true)}
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Add Availability
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Tips */}
          {availabilityList.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground/60 bg-muted/30 p-3 rounded-lg"
            >
              <p className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Tip: Add your available time slots to help students book
                sessions with you.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-border/50 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalendarDays className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">About Weekly Availability</p>
              <p className="text-xs text-muted-foreground">
                Set your regular weekly schedule. Students can book time slots
                based on your availability. You can create specific time slots
                for each day of the week.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
