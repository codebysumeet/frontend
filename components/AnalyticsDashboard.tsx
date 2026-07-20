"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { api, ApiError } from "@/services/api";
import { AnalyticsSummary } from "@/types/prediction";

const PIE_COLORS = ["#357a48", "#b06f34", "#c0453b", "#4f9e63", "#8f5827", "#dcecdf"];

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .getAnalyticsSummary()
      .then((data) => {
        setSummary(data);
        setStatus("ready");
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(
          err instanceof ApiError ? err.message : "Could not load analytics."
        );
      });
  }, []);

  if (status === "loading") {
    return (
      <div className="bg-white border border-leaf-100 rounded-lg p-8 text-center text-sm text-slate-400">
        Loading analytics...
      </div>
    );
  }

  if (status === "error" || !summary) {
    return (
      <div className="bg-white border border-leaf-100 rounded-lg p-8 text-center text-sm text-alert-600">
        {errorMessage}
      </div>
    );
  }

  if (summary.total_predictions === 0) {
    return (
      <div className="bg-white border border-leaf-100 rounded-lg p-8 text-center text-sm text-slate-400">
        No data yet - analytics will populate once predictions are recorded.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total predictions" value={summary.total_predictions} />
        <StatCard
          label="Avg. confidence"
          value={`${Math.round(summary.average_confidence * 100)}%`}
        />
        <StatCard
          label="Diseases tracked"
          value={summary.disease_distribution.length}
        />
        <StatCard
          label="Last 7 days"
          value={summary.volume_last_7_days.reduce((sum, d) => sum + d.count, 0)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white border border-leaf-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            Disease distribution
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={summary.disease_distribution}
                dataKey="count"
                nameKey="disease"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => entry.disease}
              >
                {summary.disease_distribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-leaf-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            Prediction volume - last 7 days
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summary.volume_last_7_days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f7f2" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#357a48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-leaf-100 rounded-lg p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xl font-semibold text-slate-800">{value}</p>
    </div>
  );
}
