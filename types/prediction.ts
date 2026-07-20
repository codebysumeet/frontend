export type Severity = "Low" | "Medium" | "High" | "Critical";

export interface Prediction {
  id: string;
  crop_type: string;
  image_filename: string | null;
  farmer_notes: string | null;
  predicted_disease: string;
  confidence: number; // 0.0 - 1.0
  severity: Severity | string;
  recommendation: string;
  ai_provider: string;
  created_at: string; // ISO timestamp
}

export interface PaginatedPredictions {
  items: Prediction[];
  total: number;
  page: number;
  page_size: number;
}

export interface AnalyticsSummary {
  total_predictions: number;
  average_confidence: number;
  disease_distribution: { disease: string; count: number }[];
  volume_last_7_days: { date: string; count: number }[];
}

// Generic API envelope. Matches the backend's consistent response shape:
// { success, data, message, errors }
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  errors: Record<string, unknown> | string[] | null;
}
