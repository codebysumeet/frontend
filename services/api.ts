import {
  ApiResponse,
  AnalyticsSummary,
  PaginatedPredictions,
  Prediction,
} from "@/types/prediction";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Thin wrapper around fetch that unwraps the backend's consistent
 * { success, data, message, errors } envelope and throws a typed
 * ApiError on failure, so components only ever deal with either
 * "got data" or "caught an error".
 */
export class ApiError extends Error {
  status: number;
  errors: ApiResponse<unknown>["errors"];

  constructor(message: string, status: number, errors: ApiResponse<unknown>["errors"]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new ApiError("Could not reach the server. Check your connection.", 0, null);
  }

  let body: ApiResponse<T> | null = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response (e.g. a raw 500 from a proxy) - fall through with no body.
  }

  if (!res.ok || !body || body.success === false) {
    const message = body?.message || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, body?.errors ?? null);
  }

  return body.data as T;
}

export const api = {
  health: () => request<{ status: string }>("/health"),

  createPrediction: (input: {
    image: File;
    cropType: string;
    farmerNotes?: string;
  }) => {
    const formData = new FormData();
    formData.append("image", input.image);
    formData.append("crop_type", input.cropType);
    if (input.farmerNotes) formData.append("farmer_notes", input.farmerNotes);

    return request<Prediction>("/api/v1/predictions", {
      method: "POST",
      body: formData,
    });
  },

  listPredictions: (page = 1, pageSize = 10) =>
    request<PaginatedPredictions>(
      `/api/v1/predictions?page=${page}&page_size=${pageSize}`
    ),

  getPrediction: (id: string) =>
    request<Prediction>(`/api/v1/predictions/${id}`),

  getAnalyticsSummary: () =>
    request<AnalyticsSummary>("/api/v1/analytics/summary"),
};
