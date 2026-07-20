import HistoryTable from "@/components/HistoryTable";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">
          Prediction history
        </h1>
        <p className="text-sm text-slate-500">
          Past diagnoses, most recent first.
        </p>
      </div>
      <HistoryTable />
    </div>
  );
}
