"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/services/api";
import { Prediction } from "@/types/prediction";
import PredictionDetail from "@/components/PredictionDetail";

export default function PredictionDetailPage() {
  const params = useParams<{ id: string }>();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    api
      .getPrediction(params.id)
      .then((data) => {
        setPrediction(data);
        setStatus("ready");
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Could not load this prediction."
        );
      });
  }, [params.id]);

  return (
    <div className="space-y-6">
      <Link href="/history" className="text-sm text-leaf-600 hover:underline">
        &larr; Back to history
      </Link>

      {status === "loading" && (
        <div className="bg-white border border-leaf-100 rounded-lg p-8 text-center text-sm text-slate-400">
          Loading prediction...
        </div>
      )}

      {status === "error" && (
        <div className="bg-white border border-leaf-100 rounded-lg p-8 text-center text-sm text-alert-600">
          {errorMessage}
        </div>
      )}

      {status === "ready" && prediction && (
        <PredictionDetail prediction={prediction} />
      )}
    </div>
  );
}
