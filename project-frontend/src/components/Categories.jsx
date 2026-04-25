import { useEffect, useState } from "react";
import { getCategories } from "../api/categories.api";

const categoryPresets = {
  headphones: {
    tone: "from-cyan-500 to-sky-600",
    icon: "headphones",
    description: "Immersive audio for travel, work, and gaming.",
  },
  "smart watches": {
    tone: "from-indigo-500 to-violet-600",
    icon: "watch",
    description: "Track fitness, calls, and daily productivity.",
  },
  watches: {
    tone: "from-indigo-500 to-violet-600",
    icon: "watch",
    description: "Track fitness, calls, and daily productivity.",
  },
  watch: {
    tone: "from-indigo-500 to-violet-600",
    icon: "watch",
    description: "Track fitness, calls, and daily productivity.",
  },
  accessories: {
    tone: "from-amber-500 to-orange-600",
    icon: "accessories",
    description: "Chargers, cables, cases, and useful add-ons.",
  },
};

function normalizeCategories(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

function hydrateCategory(category) {
  const normalizedName = String(category?.name || "").trim().toLowerCase();
  const preset = categoryPresets[normalizedName] || {
    tone: "from-cyan-500 to-blue-600",
    icon: "headphones",
    description: "Browse high-quality products in this category.",
  };

  return {
    id: category?.id ?? category?.name,
    name: category?.name || "Category",
    description: category?.description || preset.description,
    tone: category?.tone || preset.tone,
    icon: category?.icon || preset.icon,
  };
}

function CategoryIcon({ icon }) {
  if (icon === "watch") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden="true">
        <rect x="15" y="6" width="18" height="36" rx="7" className="fill-white/20" />
        <rect x="17" y="14" width="14" height="20" rx="5" className="fill-white" fillOpacity="0.9" />
        <path d="M24 20v6l4 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "accessories") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden="true">
        <path d="M11 22h26" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M17 22v10a7 7 0 0 0 14 0V22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <circle cx="34" cy="22" r="4" className="fill-white/30" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden="true">
      <path
        d="M12 18a12 12 0 0 1 24 0"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="9" y="18" width="8" height="14" rx="4" className="fill-white/20" />
      <rect x="31" y="18" width="8" height="14" rx="4" className="fill-white/20" />
      <path d="M18 32h12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const response = await getCategories();
        const all = normalizeCategories(response.data);

        if (active) {
          setCategories(all.map(hydrateCategory));
        }
      } catch {
        if (active) {
          setCategories([]);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Browse by type</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Categories</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {categories.length > 0 ? (
          categories.map((category) => (
            <article
              key={category.id}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/30 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className={`inline-flex rounded-2xl bg-gradient-to-br ${category.tone} p-4 text-white shadow-lg`}>
                <CategoryIcon icon={category.icon} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{category.name}</h3>
              <p className="mt-3 leading-7 text-slate-400">{category.description}</p>
              <div className="mt-6 h-px w-full bg-white/10" />
              <p className="mt-4 text-sm font-medium text-cyan-300 transition group-hover:text-cyan-200">
                Shop collection
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300 md:col-span-3">
            No categories are available right now.
          </div>
        )}
      </div>
    </section>
  );
}
