import { useRef, useState } from "react";
import Table from "./Table";
import { normalizeApiError, uploadProducts } from "../api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".xlsx", ".csv"];

function getFileExtension(fileName) {
  const index = String(fileName || "").lastIndexOf(".");
  return index >= 0 ? fileName.slice(index).toLowerCase() : "";
}

function downloadTemplate() {
  const rows = [
    ["name", "description", "price", "stock", "categoryId", "categoryName", "image", "tags"],
    ["Gaming Keyboard", "RGB mechanical keyboard", "3500", "20", "", "", "https://example.com/keyboard.jpg", "keyboard,gaming"],
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "techkhor-product-upload-template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function BulkProductUpload() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const invalidRows = Array.isArray(result?.invalidRows) ? result.invalidRows : [];

  const selectFile = (nextFile) => {
    setError("");
    setResult(null);
    setProgress(0);

    if (!nextFile) return;

    const extension = getFileExtension(nextFile.name);
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setError("Only .xlsx and .csv files are allowed.");
      setFile(null);
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setError("File size must be 5 MB or less.");
      setFile(null);
      return;
    }

    setFile(nextFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Select a product file first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setResult(null);
      setProgress(0);

      const response = await uploadProducts(file, (event) => {
        if (!event.total) {
          setProgress(50);
          return;
        }

        setProgress(Math.min(99, Math.round((event.loaded * 100) / event.total)));
      });

      setResult(response.data);
      setProgress(100);
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err) {
      setError(normalizeApiError(err));
      setResult(err?.response?.data || null);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const invalidColumns = [
    { key: "rowNumber", label: "Row" },
    { key: "name", label: "Name" },
    { key: "errors", label: "Errors" },
  ];

  const invalidData = invalidRows.map((item) => ({
    rowNumber: item.rowNumber,
    name: item?.row?.name || "-",
    errors: Array.isArray(item.errors) ? item.errors.join(", ") : "-",
  }));

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {result?.createdCount ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {result.createdCount} products uploaded successfully. {result.invalidCount || 0} invalid rows found.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Bulk products</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Upload product file</h3>
            </div>
            <button
              type="button"
              onClick={downloadTemplate}
              className="rounded-2xl border border-cyan-400/30 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/10"
            >
              Download Template
            </button>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setDragActive(false);
            }}
            onDrop={handleDrop}
            className={[
              "mt-6 flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition",
              dragActive
                ? "border-cyan-300 bg-cyan-400/10"
                : "border-white/15 bg-slate-950/70 hover:border-cyan-400/40 hover:bg-cyan-400/5",
            ].join(" ")}
          >
            <span className="max-w-full break-all text-xl font-semibold text-white">
              {file ? file.name : "Drop Excel or CSV file"}
            </span>
            <span className="mt-2 text-sm text-slate-400">.xlsx, .csv up to 5 MB</span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={(event) => selectFile(event.target.files?.[0])}
          />

          {progress > 0 ? (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Upload progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-950">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading || !file}
              className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
            >
              {uploading ? "Uploading..." : "Upload Products"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setError("");
                setResult(null);
                setProgress(0);
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
              disabled={uploading}
              className="rounded-2xl border border-white/10 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Template fields</p>
          <div className="mt-5 divide-y divide-white/10 text-sm text-slate-300">
            <div className="py-4">
              <span className="font-semibold text-slate-200">Required</span>
              <span className="mt-1 block break-words text-white">name, description, price, stock</span>
            </div>
            <div className="py-4">
              <span className="font-semibold text-slate-200">Optional</span>
              <span className="mt-1 block break-words text-white">categoryId, categoryName, image, tags</span>
            </div>
            <div className="py-4">
              <span className="font-semibold text-slate-200">Status</span>
              <span className="mt-1 block break-words text-white">Pending approval</span>
            </div>
          </div>
        </div>
      </div>

      {invalidData.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-white">Invalid rows</h3>
          <Table columns={invalidColumns} data={invalidData} rowKey="rowNumber" />
        </div>
      ) : null}
    </div>
  );
}
