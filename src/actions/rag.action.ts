"use server";

import { ragService } from "@/services/rag.service";
import { revalidateTag } from "next/cache";

// Query RAG
export const queryRagSystem = async (payload: {
  query: string;
  limit?: number;
  sourceType?: string;
}) => {
  return await ragService.queryRag(payload);
};

// Ingest all data (Admin only)
export const ingestAllData = async () => {
  const result = await ragService.ingestData();
  if (result.data) {
    revalidateTag("rag-data", "max");
  }
  return result;
};
