import { Prediction } from "@/types/prediction";

const SEVERITY_STYLES: Record<string, string> = {
  Low: "bg-leaf-100 text-leaf-700",
  Medium: "bg-soil-100 text-soil-600",
  High: "bg-alert-100 text-alert-600",
  Critical: "bg-alert-500 text-white",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PredictionDetail({
  prediction,
}: {
  prediction: Prediction;
}) {
  const confidencePct = Math.round(prediction.confidence * 100);
  const severityClass =
    SEVERITY_STYLES[prediction.severity] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="bg-white border border-leaf-100 rounded-lg p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {prediction.crop_type}
          </p>
          <h2 className="text-xl font-semibold text-slate-800">
            {prediction.predicted_disease}
          </h2>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${severityClass}`}
        >
          {prediction.severity} severity
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Confidence</span>
          <span>{confidencePct}%</span>
        </div>
        <div
          className="h-2 rounded-full bg-slate-100 overflow-hidden"
          role="progressbar"
          aria-valuenow={confidencePct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-leaf-500 rounded-full transition-all"
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
          Recommendation
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          {prediction.recommendation}
        </p>
      </div>

      {prediction.farmer_notes && (
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
            Notes
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {prediction.farmer_notes}
          </p>
        </div>
      )}

      <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
        <span>via {prediction.ai_provider}</span>
        <span>{formatDate(prediction.created_at)}</span>
      </div>
    </div>
  );
}
