import { useEffect, useState } from "react";
import { createProduct, normalizeApiError } from "../api";
import { getCategories } from "../api/categories.api";
import BulkProductUpload from "../components/BulkProductUpload";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  image: "",
};

function normalizeKeyFeatures(features) {
  if (!Array.isArray(features)) return [];

  return features
    .map((feature) => {
      const label = String(feature?.label || "").trim();
      const value = String(feature?.value || "").trim();

      if (!label && !value) return "";
      if (!label) return value;
      if (!value) return label;

      return `${label}: ${value}`;
    })
    .filter(Boolean);
}

function getFeatureLabel(feature) {
  const text = String(feature || "").trim();
  if (!text) return "";
  return text.includes(":") ? text.split(":")[0].trim() : text;
}

function getCategoryFeatureOptions(category) {
  if (!Array.isArray(category?.keyFeatures)) return [];

  return [...new Set(category.keyFeatures.map(getFeatureLabel).filter(Boolean))];
}

function getEmptyFeature(featureOptions = []) {
  return { label: featureOptions[0] || "", value: "" };
}

function FeatureFields({ features, onChange, featureOptions = [] }) {
  const safeFeatures = Array.isArray(features) && features.length > 0 ? features : [{ label: "", value: "" }];
  const selectedLabels = new Set(safeFeatures.map((feature) => feature.label).filter(Boolean));
  const hasAvailableFeature = featureOptions.some((option) => !selectedLabels.has(option));

  const updateFeature = (index, field, value) => {
    onChange(
      safeFeatures.map((feature, currentIndex) =>
        currentIndex === index ? { ...feature, [field]: value } : feature
      )
    );
  };

  const addFeature = () => {
    const usedLabels = new Set(safeFeatures.map((feature) => feature.label).filter(Boolean));
    const nextLabel = featureOptions.find((option) => !usedLabels.has(option)) || featureOptions[0] || "";
    onChange([...safeFeatures, { label: nextLabel, value: "" }]);
  };

  const removeFeature = (index) => {
    const nextFeatures = safeFeatures.filter((_, currentIndex) => currentIndex !== index);
    onChange(nextFeatures.length > 0 ? nextFeatures : [{ label: "", value: "" }]);
  };

  return (
    <div className="space-y-3">
      {safeFeatures.map((feature, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[180px_1fr_auto]">
          <select
            value={feature.label}
            onChange={(event) => updateFeature(index, "label", event.target.value)}
            disabled={featureOptions.length === 0}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          >
            {featureOptions.length === 0 ? (
              <option value="">No features in category</option>
            ) : (
              <>
                <option value="">Select feature</option>
                {featureOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </>
            )}
          </select>
          <input
            value={feature.value}
            onChange={(event) => updateFeature(index, "value", event.target.value)}
            placeholder="Galaxy A07"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />
          <button
            type="button"
            onClick={() => removeFeature(index)}
            className="rounded-2xl border border-rose-400/30 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10"
          >
            Remove
          </button>
        </div>
      ))}
      {hasAvailableFeature ? (
        <button
          type="button"
          onClick={addFeature}
          className="w-fit rounded-2xl border border-cyan-400/30 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/10"
        >
          Add feature
        </button>
      ) : null}
    </div>
  );
}

export default function AddProduct() {
  const [form, setForm] = useState(initialForm);
  const [keyFeatures, setKeyFeatures] = useState([{ label: "", value: "" }]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const selectedCategory = categories.find((category) => String(category.id) === String(form.categoryId));
  const featureOptions = getCategoryFeatureOptions(selectedCategory);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const response = await getCategories();
        if (active) {
          const list = Array.isArray(response.data) ? response.data : [];
          setCategories(list);
          setForm((current) => ({
            ...current,
            categoryId: current.categoryId || (list[0]?.id ? String(list[0].id) : ""),
          }));
          setKeyFeatures((current) => {
            const firstCategory = list[0] || null;
            const currentOptions = getCategoryFeatureOptions(firstCategory);
            const hasFeatureValue = current.some((feature) => feature.label || feature.value);

            return hasFeatureValue ? current : [getEmptyFeature(currentOptions)];
          });
        }
      } catch (err) {
        if (active) {
          setError(normalizeApiError(err));
          setCategories([]);
        }
      } finally {
        if (active) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (name === "categoryId") {
      const nextCategory = categories.find((category) => String(category.id) === String(value));
      const nextOptions = getCategoryFeatureOptions(nextCategory);
      setKeyFeatures([getEmptyFeature(nextOptions)]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.description.trim() || !form.price || !form.stock || !form.categoryId || !form.image.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      setSubmitting(true);
      await createProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        image: form.image.trim(),
        keyFeatures: normalizeKeyFeatures(keyFeatures),
      });

      setSuccess("Product created successfully. Status is pending approval.");
      setForm((current) => ({
        ...initialForm,
        categoryId: current.categoryId,
      }));
      setKeyFeatures([getEmptyFeature(featureOptions)]);
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
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

      <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">New product</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Add product</h3>

        <div className="mt-6 grid gap-5 lg:max-w-3xl">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              placeholder="Price"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              type="number"
              placeholder="Stock"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            disabled={loadingCategories || categories.length === 0}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-70"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Product image URL"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />

          <div>
            <p className="mb-3 text-sm font-medium text-slate-300">Key features</p>
            <FeatureFields
              features={keyFeatures}
              onChange={setKeyFeatures}
              featureOptions={featureOptions}
            />
            {featureOptions.length === 0 ? (
              <p className="mt-2 text-sm text-amber-300">
                Add key feature names to this category first, then sellers can select them here.
              </p>
            ) : null}
          </div>

          {form.image.trim() ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-2">
              <img
                src={form.image}
                alt="Product preview"
                className="h-44 w-full rounded-xl object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Create Product"}
          </button>
        </div>
      </form>

      <BulkProductUpload />
    </section>
  );
}
