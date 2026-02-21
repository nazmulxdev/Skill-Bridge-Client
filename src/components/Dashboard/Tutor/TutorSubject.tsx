"use client";

import { useState } from "react";
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
import { StepProps } from "@/types";

// Schema
const formSchema = z.object({
  subjectId: z.string().min(1, "Please select a subject"),
});

// Dummy available subjects
const AVAILABLE_SUBJECTS = [
  { id: "1", name: "Mathematics" },
  { id: "2", name: "Physics" },
  { id: "3", name: "Chemistry" },
  { id: "4", name: "Biology" },
  { id: "5", name: "English" },
  { id: "6", name: "History" },
  { id: "7", name: "Computer Science" },
  { id: "8", name: "Economics" },
];

export function TutorSubject({ tutorProfile, isLocked }: StepProps) {
  const [subjects, setSubjects] = useState<string[]>([
    "Mathematics",
    "Physics",
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

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
        await new Promise((resolve) => setTimeout(resolve, 500));
        const selectedSubject = AVAILABLE_SUBJECTS.find(
          (s) => s.id === value.subjectId,
        );
        if (selectedSubject && !subjects.includes(selectedSubject.name)) {
          setSubjects([...subjects, selectedSubject.name]);
        }
        form.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add subject");
      } finally {
        setIsPending(false);
      }
    },
  });

  const handleRemoveSubject = async (subject: string) => {
    setIsPending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSubjects(subjects.filter((s) => s !== subject));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove subject");
    } finally {
      setIsPending(false);
    }
  };

  const availableToAdd = AVAILABLE_SUBJECTS.filter(
    (s) => !subjects.includes(s.name),
  );

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

        {/* Selected Subjects */}
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <Badge
              key={subject}
              variant="secondary"
              className="px-3 py-1 gap-2"
            >
              {subject}
              <button
                onClick={() => handleRemoveSubject(subject)}
                disabled={isPending}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {subjects.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No subjects added yet
            </p>
          )}
        </div>

        {/* Add Subject Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex gap-2"
        >
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
                    {availableToAdd.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
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
              <Button
                type="submit"
                disabled={
                  !canSubmit || isPending || availableToAdd.length === 0
                }
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            )}
          />
        </form>

        {availableToAdd.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            You've added all available subjects!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
