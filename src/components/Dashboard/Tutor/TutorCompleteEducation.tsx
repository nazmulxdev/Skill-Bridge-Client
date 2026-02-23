"use client";

import { useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import * as z from "zod";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowLeft,
  CalendarDays,
  BookOpen,
  Building2,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Education } from "@/types";
import {
  addTutorEducation,
  deleteTutorEducation,
  updateTutorEducation,
} from "@/actions/tutor.action";
import { toast } from "sonner";

// Schema
const formSchema = z
  .object({
    institute: z.string().min(2, "Institute name is required"),
    degree: z.string().min(2, "Degree is required"),
    fieldOfStudy: z.string().min(2, "Field of study is required"),
    startYear: z
      .number()
      .min(1900, "Invalid start year")
      .max(new Date().getFullYear(), "Start year cannot be in future"),
    endYear: z.number().nullable(),
    isCurrent: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.isCurrent && !data.endYear) return false;
      if (data.endYear && data.startYear > data.endYear) return false;
      return true;
    },
    {
      message:
        "End year must be after start year or provide end year if not current",
      path: ["endYear"],
    },
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

// Format year range
const formatYearRange = (edu: Education) => {
  if (edu.isCurrent) {
    return `${edu.startYear} - Present`;
  }
  return `${edu.startYear} - ${edu.endYear}`;
};

interface TutorEducationPageProps {
  tutorProfile: any;
}

export function TutorCompleteEducation({
  tutorProfile,
}: TutorEducationPageProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const educationList = tutorProfile?.education || [];
  const totalEducation = educationList.length;

  const form = useForm({
    defaultValues: {
      institute: "",
      degree: "",
      fieldOfStudy: "",
      startYear: new Date().getFullYear(),
      endYear: null as number | null,
      isCurrent: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      setError(null);
      const toastId = toast.loading(
        editingId ? "Updating education..." : "Adding education...",
      );

      try {
        // Clean up the data
        const cleanedValue = {
          ...value,
          endYear: value.isCurrent ? null : value.endYear,
        };

        if (editingId) {
          const res = await updateTutorEducation({
            id: editingId,
            ...cleanedValue,
          });
          if (!res.data || res.error) {
            throw new Error(res.error?.message || "Failed to update");
          }
          toast.success("Education updated successfully!", { id: toastId });
        } else {
          const res = await addTutorEducation(cleanedValue);
          if (!res.data || res.error) {
            throw new Error(res.error?.message || "Failed to add");
          }
          toast.success("Education added successfully!", { id: toastId });
        }

        setIsAdding(false);
        setEditingId(null);
        form.reset();
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      } finally {
        setIsPending(false);
      }
    },
  });

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setIsAdding(true);
    form.setFieldValue("institute", edu.institute);
    form.setFieldValue("degree", edu.degree);
    form.setFieldValue("fieldOfStudy", edu.fieldOfStudy);
    form.setFieldValue("startYear", edu.startYear);
    form.setFieldValue("endYear", edu.endYear || null);
    form.setFieldValue("isCurrent", edu.isCurrent);
  };

  const handleDelete = async (id: string) => {
    setIsPending(true);
    setError(null);
    const toastId = toast.loading("Deleting education...");
    try {
      const res = await deleteTutorEducation(id);
      if (!res.data || res.error) {
        throw new Error(res.error?.message || "Failed to delete");
      }
      toast.success("Education deleted successfully!", { id: toastId });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsPending(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    form.reset();
  };

  // Watch isCurrent value
  const isCurrent = useStore(form.store, (state) => state.values.isCurrent);

  // Sort education by start year (newest first)
  const sortedEducation = [...educationList].sort(
    (a, b) => b.startYear - a.startYear,
  );

  return (
    <div className="space-y-6">
      {/* Header with Back Button and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/tutor"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Educational Background</h1>
            <p className="text-muted-foreground">
              Manage your academic qualifications and degrees
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
          >
            <GraduationCap className="h-3.5 w-3.5 mr-1" />
            Total: {totalEducation}
          </Badge>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1"
          >
            <Award className="h-3.5 w-3.5 mr-1" />
            {
              educationList.filter((e: { isCurrent: number }) => e.isCurrent)
                .length
            }{" "}
            Current
          </Badge>
        </div>
      </div>

      {/* Main Card */}
      <Card className="border-border/50 bg-gradient-to-br from-card/50 to-background overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-transparent pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 ring-2 ring-primary/20">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Your Education</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-0.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Add and manage your academic qualifications</span>
              </CardDescription>
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

          {/* Education List */}
          <AnimatePresence mode="popLayout">
            {sortedEducation.length > 0 ? (
              <motion.div layout className="space-y-3">
                {sortedEducation.map((edu: Education, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group relative flex items-center justify-between p-5 rounded-xl",
                      "border border-border/50 hover:border-primary/30",
                      "bg-gradient-to-r from-muted/30 to-transparent",
                      "transition-all duration-300 hover:shadow-md",
                      edu.isCurrent && "border-l-4 border-l-emerald-500",
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {edu.degree} in {edu.fieldOfStudy}
                        </h3>
                        {edu.isCurrent && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {edu.institute}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatYearRange(edu)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(edu)}
                        disabled={isPending}
                        className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(edu.id)}
                        disabled={isPending}
                        className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
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
                className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border/50 rounded-xl bg-muted/10"
              >
                <GraduationCap className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium text-lg">
                  No education added yet
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2 text-center max-w-md">
                  Add your degrees, certifications, and educational background
                  to build your tutor profile.
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
                      Edit Education
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 text-primary" />
                      Add New Education
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field
                      name="degree"
                      children={(field) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Degree</Label>
                          <Input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g., Bachelor of Science"
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
                      name="institute"
                      children={(field) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Institution
                          </Label>
                          <Input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g., MIT"
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

                  <form.Field
                    name="fieldOfStudy"
                    children={(field) => (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Field of Study
                        </Label>
                        <Input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g., Computer Science"
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <form.Field
                      name="startYear"
                      children={(field) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Start Year
                          </Label>
                          <Input
                            type="number"
                            value={field.state.value}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.handleChange(
                                val === ""
                                  ? new Date().getFullYear()
                                  : Number(val),
                              );
                            }}
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
                      name="endYear"
                      children={(field) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            End Year
                          </Label>
                          <Input
                            type="number"
                            value={isCurrent ? "" : field.state.value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.handleChange(
                                val === "" ? null : Number(val),
                              );
                            }}
                            disabled={isCurrent}
                            className={cn(
                              "bg-background/50 border-border/50",
                              isCurrent && "opacity-50 cursor-not-allowed",
                            )}
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
                      name="isCurrent"
                      children={(field) => (
                        <div className="flex items-center gap-2 pt-8">
                          <Checkbox
                            checked={field.state.value}
                            onCheckedChange={(checked) => {
                              const isChecked = checked === true;
                              field.handleChange(isChecked);
                              if (isChecked) {
                                form.setFieldValue("endYear", null);
                              }
                            }}
                          />
                          <Label className="text-sm">Currently studying</Label>
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
                          disabled={!canSubmit || isPending}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              {editingId ? "Update" : "Add"}
                            </>
                          )}
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
                  Add Education
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card className="border-border/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Why add education?</p>
                    <p className="text-xs text-muted-foreground">
                      Students trust tutors with verified educational
                      backgrounds. Add your degrees and certifications to build
                      credibility.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-emerald-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Current Education</p>
                    <p className="text-xs text-muted-foreground">
                      Mark entries as "Currently studying" if you're still
                      pursuing the degree. This will automatically set end year
                      to null.
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
