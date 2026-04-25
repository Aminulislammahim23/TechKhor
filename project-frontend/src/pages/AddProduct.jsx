import { useEffect, useState } from "react";
import { createProduct, normalizeApiError } from "../api";
import { getCategories } from "../api/categories.api";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  image: "",
};

export default function AddProduct() {
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      });

      setSuccess("Product created successfully. Status is pending approval.");
      setForm((current) => ({
        ...initialForm,
        categoryId: current.categoryId,
      }));
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
    </section>
  );
}
