"use client";

import { useState, useRef } from "react";
import { api, ApiError } from "@/services/api";
import { Prediction } from "@/types/prediction";

const CROP_TYPES = [
  "Tomato",
  "Potato",
  "Rice",
  "Wheat",
  "Maize",
  "Cotton",
  "Sugarcane",
  "Chili",
];

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface UploadPanelProps {
  onResult: (prediction: Prediction) => void;
}

export default function UploadPanel({ onResult }: UploadPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropType, setCropType] = useState(CROP_TYPES[0]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    setErrorMessage(null);
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setErrorMessage("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function resetForm() {
    setFile(null);
    setPreviewUrl(null);
    setNotes("");
    setStatus("idle");
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Select an image before analyzing.");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    try {
      const prediction = await api.createPrediction({
        image: file,
        cropType,
        farmerNotes: notes || undefined,
      });
      setStatus("idle");
      onResult(prediction);
      resetForm();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Something went wrong while analyzing the image. Try again."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-leaf-100 rounded-lg p-6 space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Crop image
        </label>
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 rounded-md border border-dashed border-leaf-100 bg-leaf-50 flex items-center justify-center overflow-hidden shrink-0">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Selected crop preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-400 text-center px-2">
                No image selected
              </span>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-leaf-500 file:text-white file:text-sm file:font-medium hover:file:bg-leaf-600 file:cursor-pointer cursor-pointer"
            />
            <p className="text-xs text-slate-400 mt-1">
              JPEG, PNG, or WebP. Up to {MAX_FILE_SIZE_MB}MB.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="crop-type" className="block text-sm font-medium text-slate-700 mb-1">
          Crop type
        </label>
        <select
          id="crop-type"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="w-full sm:w-64 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-leaf-500 focus:ring-leaf-500"
        >
          {CROP_TYPES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
          Notes <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Anything the field agronomist observed - leaf pattern, weather, when symptoms started..."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-leaf-500 focus:ring-leaf-500"
        />
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-md bg-alert-100 text-alert-600 text-sm px-3 py-2"
        >
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-md bg-leaf-600 text-white text-sm font-medium px-4 py-2 hover:bg-leaf-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" && (
          <span
            className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"
            aria-hidden
          />
        )}
        {status === "loading" ? "Analyzing image..." : "Analyze crop"}
      </button>
    </form>
  );
}
