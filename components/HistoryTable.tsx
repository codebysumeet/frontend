"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, ApiError } from "@/services/api";
import { Prediction } from "@/types/prediction";

const PAGE_SIZE = 10;

export default function HistoryTable() {
  const [items, setItems] = useState<Prediction[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async (targetPage: number) => {
    setStatus("loading");
    try {
      const result = await api.listPredictions(targetPage, PAGE_SIZE);
      setItems(result.items);
      setTotal(result.total);
      setPage(result.page);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof ApiError ? err.message : "Could not load history."
      );
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (status === "loading") {
    return (
      <div className="bg-white border border-leaf-100 rounded-lg p-8 text-center text-sm text-slate-400">
        Loading prediction history...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-white border border-leaf-100 rounded-lg p-8 text-center">
        <p className="text-sm text-alert-600 mb-3">{errorMessage}</p>
        <button
          onClick={() => load(page)}
          className="text-sm font-medium text-leaf-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-leaf-100 rounded-lg p-8 text-center text-sm text-slate-400">
        No predictions yet. Analyze a crop image to see it here.
      </div>
    );
  }

  return (
    <div className="bg-white border border-leaf-100 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-leaf-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Crop</th>
              <th className="px-4 py-3 font-medium">Disease</th>
              <th className="px-4 py-3 font-medium">Confidence</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-leaf-50/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/predictions/${p.id}`}
                    className="text-leaf-700 hover:underline font-medium"
                  >
                    {p.crop_type}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {p.predicted_disease}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {Math.round(p.confidence * 100)}%
                </td>
                <td className="px-4 py-3 text-slate-500">{p.severity}</td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm">
        <span className="text-slate-400">
          Page {page} of {totalPages} &middot; {total} total
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => load(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 rounded-md border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-leaf-50"
          >
            Previous
          </button>
          <button
            onClick={() => load(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded-md border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-leaf-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
