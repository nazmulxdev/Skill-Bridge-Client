"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import {
  BookOpen,
  Plus,
  X,
  Loader2,
  ArrowLeft,
  FolderOpen,
  CheckCircle2,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import {
  addTutorSubjects,
  getAllCategoryWithSubject,
  removeTutorSubject,
} from "@/actions/tutor.action";
import { toast } from "sonner";

// Schema
const formSchema = z.object({
  subjectId: z.string().min(1, "Please select a subject"),
});

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

interface TutorSubjectsPageProps {
  tutorProfile: any;
}

export function TutorCompleteSubjects({
  tutorProfile,
}: TutorSubjectsPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Get existing subjects from tutorProfile
  const existingSubjects =
    tutorProfile?.subjects?.map((s: any) => ({
      id: s.subject.id,
      name: s.subject.name,
      categoryName: s.subject.category?.name,
      categoryId: s.subject.category?.id,
    })) || [];

  const existingSubjectIds = existingSubjects.map((s: { id: string }) => s.id);
  const totalSubjects = existingSubjects.length;

  // Group existing subjects by category
  const groupedExistingSubjects = existingSubjects.reduce(
    (acc: any, subject: { categoryName: string }) => {
      const category = subject.categoryName || "Other";
      if (!acc[category]) {
        acc[category] = {
          name: category,
          subjects: [],
        };
      }
      acc[category].subjects.push(subject);
      return acc;
    },
    {},
  );

  const form = useForm({
    defaultValues: {
      subjectId: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      setError(null);
      const toastId = toast.loading("Adding subject...");

      try {
        const res = await addTutorSubjects([value.subjectId]);
        if (!res.data || res.error) {
          throw new Error(res.error?.message || "Failed to add subject");
        }
        toast.success("Subject added successfully!", { id: toastId });
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

  const handleRemoveSubject = async (subjectId: string) => {
    setIsPending(true);
    setError(null);
    const toastId = toast.loading("Removing subject...");
    try {
      const res = await removeTutorSubject(subjectId);
      if (!res.data || res.error) {
        throw new Error(res.error?.message || "Failed to remove subject");
      }
      toast.success("Subject removed successfully!", { id: toastId });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsPending(false);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getAllCategoryWithSubject();
        if (result.data) {
          setCategories(result.data);
        } else {
          setError("Failed to load subjects");
        }
      } catch (err) {
        setError("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Back Button and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Teaching Subjects</h1>
            <p className="text-muted-foreground">
              Manage the subjects you teach
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 px-3 py-1"
          >
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            Total: {totalSubjects}
          </Badge>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1"
          >
            <GraduationCap className="h-3.5 w-3.5 mr-1" />
            Categories: {Object.keys(groupedExistingSubjects).length}
          </Badge>
        </div>
      </div>

      {/* Main Card */}
      <Card className="border-border/50 bg-gradient-to-br from-card/50 to-background overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-transparent pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 ring-2 ring-primary/20">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Your Subjects</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-0.5">
                <FolderOpen className="h-3.5 w-3.5" />
                <span>
                  Select and manage subjects from different categories
                </span>
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

          {/* Selected Subjects by Category */}
          <AnimatePresence mode="popLayout">
            {existingSubjects.length > 0 ? (
              <motion.div layout className="space-y-6">
                {Object.entries(groupedExistingSubjects).map(
                  ([category, data]: [string, any], index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <h3 className="font-semibold text-lg">{category}</h3>
                        <Badge variant="outline" className="ml-2 bg-primary/5">
                          {data.subjects.length}{" "}
                          {data.subjects.length === 1 ? "subject" : "subjects"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 pl-4">
                        {data.subjects.map((subject: any, idx: number) => (
                          <motion.div
                            key={subject.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Badge
                              variant="secondary"
                              className="px-4 py-2 gap-2 text-sm group hover:bg-destructive/10 transition-colors"
                            >
                              {subject.name}
                              <button
                                onClick={() => handleRemoveSubject(subject.id)}
                                disabled={isPending}
                                className="hover:text-destructive ml-1"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ),
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border/50 rounded-xl bg-muted/10"
              >
                <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium text-lg">
                  No subjects added yet
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2 text-center max-w-md">
                  Select subjects from the dropdown below to start building your
                  teaching profile.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Separator className="bg-border/50" />

          {/* Add Subject Form */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                <Loader2 className="h-8 w-8 animate-spin text-primary relative" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5 text-primary" />
                Add New Subject
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <form.Field
                    name="subjectId"
                    children={(field) => (
                      <div className="flex-1">
                        <Select
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger className="bg-background/50 border-border/50 h-11">
                            <SelectValue placeholder="Select a subject to add" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <div key={category.id}>
                                {/* Category header */}
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                                  {category.name}
                                </div>
                                {/* Subjects under category */}
                                {category.subjects
                                  .filter(
                                    (subject) =>
                                      !existingSubjectIds.includes(subject.id),
                                  )
                                  .map((subject) => (
                                    <SelectItem
                                      key={subject.id}
                                      value={subject.id}
                                      className="pl-6"
                                    >
                                      {subject.name}
                                    </SelectItem>
                                  ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.errors && (
                          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <form.Subscribe
                    selector={(state) => [state.canSubmit]}
                    children={([canSubmit]) => (
                      <Button
                        type="submit"
                        disabled={!canSubmit || isPending}
                        className="h-11 px-6 gap-2"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            Add Subject
                          </>
                        )}
                      </Button>
                    )}
                  />
                </div>
              </form>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card className="border-border/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">About Subjects</p>
                    <p className="text-xs text-muted-foreground">
                      Add subjects you're qualified to teach. Students will see
                      these when searching for tutors.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Categories</p>
                    <p className="text-xs text-muted-foreground">
                      Subjects are grouped by category. Select from various
                      categories to expand your reach.
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
