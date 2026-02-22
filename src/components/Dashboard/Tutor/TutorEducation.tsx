"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Lock,
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
import { Education, StepProps } from "@/types";

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

export function TutorEducation({ tutorProfile, isLocked }: StepProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const [educationList, setEducationList] = useState<Education[]>(
    tutorProfile.education,
  );

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

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (editingId) {
          setEducationList((prev) =>
            prev.map((edu) =>
              edu.id === editingId
                ? ({ ...value, id: editingId } as Education)
                : edu,
            ),
          );
        } else {
          const newEdu = { ...value, id: Date.now().toString() } as Education;
          setEducationList((prev) => [...prev, newEdu]);
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
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEducationList((prev) => prev.filter((edu) => edu.id !== id));
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
              Step 2: Education
            </CardTitle>
          </div>
          <CardDescription>Complete Step 1 to unlock</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Step 2: Education</CardTitle>
        </div>
        <CardDescription>Add your educational background</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Education List */}
        <div className="space-y-3">
          {educationList.map((edu) => (
            <div
              key={edu.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {edu.degree} in {edu.fieldOfStudy}
                </p>
                <p className="text-sm text-muted-foreground">
                  {edu.institute} • {edu.startYear} -{" "}
                  {edu.isCurrent ? "Present" : edu.endYear}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(edu)}
                  disabled={isPending}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(edu.id)}
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
              {editingId ? "Edit Education" : "Add New Education"}
            </h4>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="degree"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g., Bachelor of Science"
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
                  name="institute"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g., MIT"
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

              <form.Field
                name="fieldOfStudy"
                children={(field) => (
                  <div className="space-y-2">
                    <Label>Field of Study</Label>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g., Computer Science"
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs text-destructive">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <form.Field
                  name="startYear"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label>Start Year</Label>
                      <Input
                        type="number"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
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
                  name="endYear"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label>End Year</Label>
                      <Input
                        type="number"
                        value={field.state.value || ""}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                        disabled={form.getFieldValue("isCurrent")}
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
                  name="isCurrent"
                  children={(field) => (
                    <div className="flex items-center gap-2 pt-8">
                      <Checkbox
                        checked={field.state.value}
                        onCheckedChange={(checked) => {
                          field.handleChange(checked);
                          if (checked) form.setFieldValue("endYear", null);
                        }}
                      />
                      <Label>Currently studying</Label>
                    </div>
                  )}
                />
              </div>
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
            Add Education
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
