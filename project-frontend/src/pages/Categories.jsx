import { useEffect, useState } from "react";
import { normalizeApiError } from "../api";
import { createCategory, getCategories } from "../api/categories.api";
import Table from "../components/Table";

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        setLoading(true);
        setError("");
        const response = await getCategories();
        if (active) {
          setCategories(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (active) {
          setError(normalizeApiError(err));
          setCategories([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      const response = await createCategory({ name: name.trim() });
      const created = response?.data;

      setCategories((current) => [created, ...current]);
      setName("");
      setSuccess("Category created successfully.");
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Category Name" },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) =>
        row?.createdAt
          ? new Date(row.createdAt).toISOString().slice(0, 10)
          : "-",
    },
  ];

  return (
    <section className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30"
      >
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Category management</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Create category</h3>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter category name"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Creating..." : "Create"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          Loading categories...
        </div>
      ) : (
        <Table columns={columns} data={categories} rowKey="id" />
      )}
    </section>
  );
}
