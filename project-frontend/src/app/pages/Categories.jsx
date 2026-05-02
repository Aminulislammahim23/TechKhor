import { useEffect, useState } from "react";
import { normalizeApiError } from "../api";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../api/categories.api";
import Table from "../components/Table";

function normalizeKeyFeatures(features) {
  if (!Array.isArray(features)) return [];

  return features.map((feature) => String(feature || "").trim()).filter(Boolean);
}

function getEditableFeatures(features) {
  const normalized = normalizeKeyFeatures(features);
  return normalized.length > 0 ? normalized : [""];
}

function FeatureFields({ features, onChange }) {
  const safeFeatures = Array.isArray(features) && features.length > 0 ? features : [""];

  const updateFeature = (index, value) => {
    onChange(safeFeatures.map((feature, currentIndex) => (currentIndex === index ? value : feature)));
  };

  const addFeature = () => {
    onChange([...safeFeatures, ""]);
  };

  const removeFeature = (index) => {
    const nextFeatures = safeFeatures.filter((_, currentIndex) => currentIndex !== index);
    onChange(nextFeatures.length > 0 ? nextFeatures : [""]);
  };

  return (
    <div className="space-y-3">
      {safeFeatures.map((feature, index) => (
        <div key={index} className="flex min-w-72 gap-2">
          <input
            value={feature}
            onChange={(event) => updateFeature(index, event.target.value)}
            placeholder="Enter one key feature"
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />
          <button
            type="button"
            onClick={() => removeFeature(index)}
            className="rounded-xl border border-rose-400/30 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addFeature}
        className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/10"
      >
        Add feature
      </button>
    </div>
  );
}

function FeaturePreview({ features }) {
  const normalized = normalizeKeyFeatures(features);

  if (normalized.length === 0) {
    return <span className="text-slate-500">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {normalized.map((feature) => (
        <span key={feature} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
          {feature}
        </span>
      ))}
    </div>
  );
}

export default function Categories() {
  const [name, setName] = useState("");
  const [keyFeatures, setKeyFeatures] = useState([""]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingKeyFeatures, setEditingKeyFeatures] = useState([""]);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
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
      const response = await createCategory({
        name: name.trim(),
        keyFeatures: normalizeKeyFeatures(keyFeatures),
      });
      const created = response?.data;

      setCategories((current) => [created, ...current]);
      setName("");
      setKeyFeatures([""]);
      setSuccess("Category created successfully.");
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (category) => {
    setError("");
    setSuccess("");
    setEditingId(category.id);
    setEditingName(category.name || "");
    setEditingKeyFeatures(getEditableFeatures(category.keyFeatures));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingKeyFeatures([""]);
  };

  const handleUpdate = async (category) => {
    const nextName = editingName.trim();

    if (!nextName) {
      setError("Category name is required.");
      return;
    }

    const nextKeyFeatures = normalizeKeyFeatures(editingKeyFeatures);
    const currentKeyFeatures = normalizeKeyFeatures(category.keyFeatures || []);

    if (nextName === category.name && JSON.stringify(nextKeyFeatures) === JSON.stringify(currentKeyFeatures)) {
      cancelEdit();
      return;
    }

    try {
      setUpdatingId(category.id);
      setError("");
      setSuccess("");

      const response = await updateCategory(category.id, {
        name: nextName,
        keyFeatures: nextKeyFeatures,
      });
      const updated = response?.data;

      setCategories((current) =>
        current.map((item) => (item.id === category.id ? { ...item, ...updated } : item))
      );
      cancelEdit();
      setSuccess("Category updated successfully.");
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (category) => {
    if (!category?.id) return;

    if (!window.confirm(`Delete category "${category.name}"?`)) {
      return;
    }

    try {
      setDeletingId(category.id);
      setError("");
      setSuccess("");

      await deleteCategory(category.id);

      setCategories((current) => current.filter((item) => item.id !== category.id));
      setSuccess("Category deleted successfully.");
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "name",
      label: "Category Name",
      render: (row) =>
        editingId === row.id ? (
          <input
            value={editingName}
            onChange={(event) => setEditingName(event.target.value)}
            className="w-full min-w-56 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />
        ) : (
          row.name
        ),
    },
    {
      key: "keyFeatures",
      label: "Key Features",
      render: (row) =>
        editingId === row.id ? (
          <FeatureFields
            features={editingKeyFeatures}
            onChange={setEditingKeyFeatures}
          />
        ) : (
          <FeaturePreview features={row.keyFeatures} />
        ),
    },
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
        <div className="mt-5">
          <p className="mb-3 text-sm font-medium text-slate-300">Key features</p>
          <FeatureFields features={keyFeatures} onChange={setKeyFeatures} />
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
        <Table
          columns={columns}
          data={categories}
          rowKey="id"
          renderRowActions={(category) => (
            editingId === category.id ? (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate(category)}
                  disabled={updatingId === category.id}
                  className="rounded-xl border border-emerald-400/30 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updatingId === category.id ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={updatingId === category.id}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(category)}
                  disabled={Boolean(deletingId)}
                  className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category)}
                  disabled={deletingId === category.id}
                  className="rounded-xl border border-rose-400/30 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === category.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            )
          )}
        />
      )}
    </section>
  );
}
