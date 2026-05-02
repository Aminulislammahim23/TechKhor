import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/categories.api";

const categoryPresets = {
  smartphones: {
    tone: "from-sky-500 to-blue-600",
    icon: "smartphone",
    description: "Browse high-quality products in this category.",
  },
  "phone cases": {
    tone: "from-teal-500 to-cyan-600",
    icon: "phone-case",
    description: "Browse high-quality products in this category.",
  },
  chargers: {
    tone: "from-emerald-500 to-teal-600",
    icon: "charger",
    description: "Browse high-quality products in this category.",
  },
  "power banks": {
    tone: "from-lime-500 to-emerald-600",
    icon: "power-bank",
    description: "Browse high-quality products in this category.",
  },
  laptops: {
    tone: "from-violet-500 to-indigo-600",
    icon: "laptop",
    description: "Browse high-quality products in this category.",
  },
  keyboards: {
    tone: "from-fuchsia-500 to-rose-600",
    icon: "keyboard",
    description: "Browse high-quality products in this category.",
  },
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

const categoryMatchers = [
  { match: ["case", "cover"], preset: categoryPresets["phone cases"] },
  { match: ["smartphone", "phone", "mobile"], preset: categoryPresets.smartphones },
  { match: ["charger", "adapter", "cable"], preset: categoryPresets.chargers },
  { match: ["power bank", "powerbank", "battery"], preset: categoryPresets["power banks"] },
  { match: ["laptop", "notebook"], preset: categoryPresets.laptops },
  { match: ["keyboard"], preset: categoryPresets.keyboards },
  { match: ["headphone", "earphone", "earbud", "audio"], preset: categoryPresets.headphones },
  { match: ["smart watch", "watch"], preset: categoryPresets.watches },
  { match: ["accessory", "accessories"], preset: categoryPresets.accessories },
];

function normalizeCategories(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

function hydrateCategory(category) {
  const normalizedName = String(category?.name || "").trim().toLowerCase();
  const preset = categoryPresets[normalizedName] ||
    categoryMatchers.find(({ match }) => match.some((keyword) => normalizedName.includes(keyword)))?.preset || {
    tone: "from-cyan-500 to-blue-600",
    icon: "category",
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
  if (icon === "smartphone") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden="true">
        <rect x="15" y="6" width="18" height="36" rx="5" className="fill-white/20" />
        <rect x="18" y="10" width="12" height="27" rx="2" className="fill-white" fillOpacity="0.9" />
        <path d="M22 39h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "phone-case") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden="true">
        <rect x="14" y="5" width="20" height="38" rx="6" stroke="currentColor" strokeWidth="4" />
        <rect x="18" y="10" width="12" height="25" rx="2" className="fill-white/25" />
        <circle cx="29" cy="12" r="2" className="fill-white" fillOpacity="0.9" />
      </svg>
    );
  }

  if (icon === "charger") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden="true">
        <rect x="15" y="17" width="18" height="20" rx="5" className="fill-white/20" />
        <path d="M20 17V9M28 17V9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M24 23l-4 7h5l-2 7 6-10h-5l2-4z" className="fill-white" fillOpacity="0.9" />
      </svg>
    );
  }

  if (icon === "power-bank") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden="true">
        <rect x="9" y="15" width="28" height="20" rx="6" className="fill-white/20" />
        <path d="M37 21h3v8h-3" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M20 20l-4 7h5l-2 6 7-10h-5l2-3z" className="fill-white" fillOpacity="0.9" />
      </svg>
    );
  }

  if (icon === "laptop") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden="true">
        <rect x="10" y="11" width="28" height="20" rx="3" className="fill-white/20" />
        <rect x="14" y="15" width="20" height="12" rx="1" className="fill-white" fillOpacity="0.9" />
        <path d="M7 35h34l-3 5H10z" className="fill-white/30" />
      </svg>
    );
  }

  if (icon === "keyboard") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden="true">
        <rect x="7" y="14" width="34" height="22" rx="5" className="fill-white/20" />
        <path
          d="M14 21h.01M21 21h.01M28 21h.01M35 21h.01M14 28h.01M21 28h14M14 34h20"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

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

      <div className="-mx-4 flex snap-x gap-6 overflow-x-auto px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.name)}&categoryId=${encodeURIComponent(category.id)}`}
              className="group min-w-[290px] snap-start rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/30 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] sm:min-w-[360px] xl:min-w-[390px]"
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
            </Link>
          ))
        ) : (
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
            No categories are available right now.
          </div>
        )}
      </div>
    </section>
  );
}
