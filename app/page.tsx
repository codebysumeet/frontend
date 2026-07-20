"use client";

import { useState } from "react";
import UploadPanel from "@/components/UploadPanel";
import PredictionDetail from "@/components/PredictionDetail";
import { Prediction } from "@/types/prediction";

export default function HomePage() {
  const [latest, setLatest] = useState<Prediction | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">
          Upload a crop image
        </h1>
        <p className="text-sm text-slate-500">
          Get an instant AI-assisted diagnosis and recommendation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <UploadPanel onResult={setLatest} />
        {latest ? (
          <PredictionDetail prediction={latest} />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full min-h-[200px] rounded-lg border border-dashed border-leaf-100 text-sm text-slate-400">
            Results will appear here after analysis
          </div>
        )}
      </div>
    </div>
  );
}
