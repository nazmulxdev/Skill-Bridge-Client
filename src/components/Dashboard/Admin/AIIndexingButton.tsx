"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2, Database } from "lucide-react";
import { toast } from "sonner";
import { ingestAllData } from "@/actions/rag.action";

export function AIIndexingButton() {
  const [isIndexing, setIsIndexing] = useState(false);

  const handleIndexing = async () => {
    setIsIndexing(true);
    const toastId = toast.loading("Indexing all data for AI...");

    try {
      const { data, error } = await ingestAllData();

      if (error || !data) {
        toast.error("Failed to index data", { id: toastId });
      } else {
        toast.success(`Indexed ${data.total} documents!`, {
          id: toastId,
          description: `Tutors: ${data.tutors}, Subjects: ${data.subjects}, FAQs: ${data.faqs}`,
        });
      }
    } catch {
      toast.error("Indexing failed", { id: toastId });
    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">AI Data Indexing</p>
              <p className="text-xs text-muted-foreground">
                Index tutors, subjects & FAQs for AI chat
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleIndexing}
            disabled={isIndexing}
            className="gap-2"
          >
            {isIndexing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Indexing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Index Now
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
