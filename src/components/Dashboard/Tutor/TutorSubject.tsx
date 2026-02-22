"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { BookOpen, Plus, X, Loader2, Lock } from "lucide-react";
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
import { Category, StepProps } from "@/types";
import {
  addTutorSubjects,
  getAllCategoryWithSubject,
  removeTutorSubject,
} from "@/actions/tutor.action";

// Schema
const formSchema = z.object({
  subjectId: z.string().min(1, "Please select a subject"),
});

export function TutorSubject({ tutorProfile, isLocked }: StepProps) {
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
    })) || [];

  const existingSubjectIds = existingSubjects.map((s: { id: string }) => s.id);

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

      try {
        const res = await addTutorSubjects([value.subjectId]);
        if (!res.data || res.error) {
          throw new Error(res.error?.message || "Failed to add subject");
        }
        form.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add subject");
      } finally {
        setIsPending(false);
      }
    },
  });

  const handleRemoveSubject = async (subjectId: string) => {
    setIsPending(true);
    setError(null);
    try {
      const res = await removeTutorSubject(subjectId);

      if (!res.data || res.error) {
        throw new Error(res.error?.message || "Failed to remove subject");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove subject");
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
  if (isLocked) {
    return (
      <Card className="border-border/50 bg-card/50 opacity-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg text-muted-foreground">
              Step 3: Subjects
            </CardTitle>
          </div>
          <CardDescription>Complete Step 2 to unlock</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Step 3: Subjects</CardTitle>
        </div>
        <CardDescription>Select the subjects you teach</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Selected Subjects by Category */}
        <div className="space-y-4">
          {existingSubjects.length > 0 ? (
            // Group subjects by category
            Object.entries(
              existingSubjects.reduce((acc: any, subject: any) => {
                const category = subject.categoryName || "Other";
                if (!acc[category]) acc[category] = [];
                acc[category].push(subject);
                return acc;
              }, {}),
            ).map(([category, subjects]: [string, any]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject: { id: string; name: string }) => (
                    <Badge
                      key={subject.id}
                      variant="secondary"
                      className="px-3 py-1 gap-2"
                    >
                      {subject.name}
                      <button
                        onClick={() => handleRemoveSubject(subject.id)}
                        disabled={isPending}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No subjects added yet. Select subjects below to get started.
            </p>
          )}
        </div>

        {/* Add Subject Form */}
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
            <div className="flex gap-2">
              <form.Field
                name="subjectId"
                children={(field) => (
                  <div className="flex-1">
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <div key={category.id}>
                            {/* Category header as disabled item */}
                            <SelectItem
                              value={`category-${category.id}`}
                              disabled
                              className="font-semibold text-primary bg-muted/50"
                            >
                              {category.name}
                            </SelectItem>
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
                      <p className="text-xs text-destructive mt-1">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              />

              <form.Subscribe
                selector={(state) => [state.canSubmit]}
                children={([canSubmit]) => (
                  <Button type="submit" disabled={!canSubmit || isPending}>
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
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
