import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Analytics</h1>
        <p className="text-sm text-slate-500">
          Aggregate stats across all recorded predictions.
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
