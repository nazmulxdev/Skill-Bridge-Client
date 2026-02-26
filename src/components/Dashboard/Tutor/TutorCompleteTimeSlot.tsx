"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import {
  Calendar,
  Plus,
  Trash2,
  Pencil,
  Clock,
  CalendarDays,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TimeSlot } from "@/types";
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

// Get status color
const getStatusColor = (isBooked: boolean) => {
  return isBooked
    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
};

interface TutorCompleteTimeSlotProps {
  tutorProfile: any;
}

export function TutorCompleteTimeSlot({
  tutorProfile,
}: TutorCompleteTimeSlotProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Data directly from database
  const slots = tutorProfile?.tutorTimeSlots || [];
  const upcomingSlots = slots.filter(
    (slot: TimeSlot) => new Date(slot.date) >= new Date() && !slot.isBooked,
  ).length;

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
    form.setFieldValue("date", slot.date.split("T")[0]);
    form.setFieldValue("startTime", slot.startTime);
    form.setFieldValue("endTime", slot.endTime);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    form.reset();
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

  // Group slots by date and sort
  const groupedSlots = slots
    .sort(
      (a: TimeSlot, b: TimeSlot) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
    .reduce((acc: Record<string, TimeSlot[]>, slot: TimeSlot) => {
      const dateKey = slot.date.split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(slot);
      return acc;
    }, {});

  return (
    <div className="space-y-6">
      {/* Header with Back Button and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Time Slots</h1>
            <p className="text-muted-foreground">
              Create and manage your available teaching slots
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
          >
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Total: {slots.length}
          </Badge>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1"
          >
            <Clock className="h-3.5 w-3.5 mr-1" />
            Upcoming: {upcomingSlots}
          </Badge>
        </div>
      </div>

      <Card className="border-border/50 bg-gradient-to-br from-card/50 to-background overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-transparent pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 ring-2 ring-primary/20">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Manage Your Time Slots
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-0.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Create specific time slots for students to book</span>
                </CardDescription>
              </div>
            </div>
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

          {/* Time Slots by Date */}
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedSlots).length > 0 ? (
              <motion.div layout className="space-y-6">
                {Object.entries(groupedSlots).map(
                  ([date, dateSlots], groupIndex) => {
                    const typedSlots = dateSlots as TimeSlot[];
                    const isPastDate = new Date(date) < new Date();

                    return (
                      <motion.div
                        key={date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              isPastDate
                                ? "bg-muted-foreground/30"
                                : "bg-primary",
                            )}
                          />
                          <h3 className="font-semibold text-lg">
                            {formatDisplayDate(date)}
                          </h3>
                          <Badge variant="outline" className="ml-2">
                            {typedSlots.length}{" "}
                            {typedSlots.length === 1 ? "slot" : "slots"}
                          </Badge>
                          {isPastDate && (
                            <Badge
                              variant="outline"
                              className="bg-muted/50 text-muted-foreground"
                            >
                              Past
                            </Badge>
                          )}
                        </div>

                        <div className="grid gap-2 pl-4">
                          {typedSlots.map((slot: TimeSlot, index) => (
                            <motion.div
                              key={slot.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={cn(
                                "group relative flex items-center justify-between p-4 rounded-xl",
                                "border border-border/50 hover:border-primary/30",
                                "bg-gradient-to-r from-muted/30 to-transparent",
                                "transition-all duration-300 hover:shadow-md",
                                slot.isBooked && "opacity-75 hover:opacity-100",
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "px-3 py-1.5 font-mono",
                                      getStatusColor(slot.isBooked),
                                    )}
                                  >
                                    {slot.startTime}
                                  </Badge>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "px-3 py-1.5 font-mono",
                                      getStatusColor(slot.isBooked),
                                    )}
                                  >
                                    {slot.endTime}
                                  </Badge>
                                </div>
                                <Badge
                                  variant={
                                    slot.isBooked ? "secondary" : "outline"
                                  }
                                  className={cn(
                                    "px-2 py-0.5",
                                    slot.isBooked
                                      ? "bg-amber-500/10 text-amber-600"
                                      : "bg-emerald-500/10 text-emerald-600",
                                  )}
                                >
                                  {slot.isBooked ? "Booked" : "Available"}
                                </Badge>
                              </div>

                              {!slot.isBooked && (
                                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(slot)}
                                    disabled={isAdding}
                                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(slot.id)}
                                    disabled={isAdding}
                                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  },
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border/50 rounded-xl bg-muted/10"
              >
                <Calendar className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium text-lg">
                  No time slots created
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2 text-center max-w-md">
                  Create your first time slot below. Students can book available
                  slots for their learning sessions.
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
                      Edit Time Slot
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 text-primary" />
                      Create New Time Slot
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
                      name="date"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Date</Label>
                            <Input
                              type="date"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              min={new Date().toISOString().split("T")[0]}
                              className="bg-background/50 border-border/50"
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
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Start Time
                            </Label>
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="10:00"
                              className="bg-background/50 border-border/50"
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
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              End Time
                            </Label>
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="11:00"
                              className="bg-background/50 border-border/50"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </div>
                        );
                      }}
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
                          {editingId ? "Update" : "Create"}
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
                  onClick={() => {
                    setIsAdding(true);
                    setEditingId(null);
                    form.reset();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Create New Time Slot
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card className="border-border/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">About Time Slots</p>
                    <p className="text-xs text-muted-foreground">
                      Create specific time slots based on your weekly
                      availability. Students can book these slots for their
                      learning sessions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Booking Status</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-emerald-600 font-medium">
                        Available
                      </span>{" "}
                      slots can be edited or deleted.
                      <span className="text-amber-600 font-medium">
                        {" "}
                        Booked
                      </span>{" "}
                      slots are locked and cannot be modified.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
