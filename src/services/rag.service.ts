import { env } from "@/env";
import { cookies } from "next/headers";

export const ragService = {
  // Query RAG
  queryRag: async function (payload: {
    query: string;
    limit?: number;
    sourceType?: string;
  }) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/rag/query`, {
        method: "POST",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success) {
        return { data: null, error: data.error };
      }

      return { data: data.data, error: null };
    } catch (error) {
      console.error("RAG query error:", error);
      return { data: null, error };
    }
  },

  // Ingest/Index all data
  ingestData: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${env.API_URL}/rag/ingest`, {
        method: "POST",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      const data = await res.json();

      if (!data.success) {
        return { data: null, error: data.error };
      }

      return { data: data.data, error: null };
    } catch (error) {
      console.error("RAG ingest error:", error);
      return { data: null, error };
    }
  },
};
