import { Link } from "react-router-dom";

function getCategoryName(product) {
  return product?.category?.name || product?.categoryName || "Uncategorized";
}

function formatCount(value, suffix = "") {
  const number = Number(value) || 0;
  const formatted = new Intl.NumberFormat("en-US", { notation: number >= 1000 ? "compact" : "standard" }).format(number);

  return `${formatted}${suffix}`;
}

function getHeroMetrics(products) {
  const categoryMap = new Map();
  const availableProducts = products.filter((product) => Number(product?.stock) > 0);
  const offerProducts = products.filter((product) => product?.isOffer && Number(product?.offerPrice) > 0);

  products.forEach((product) => {
    const category = getCategoryName(product);
    const current = categoryMap.get(category) || {
      name: category,
      count: 0,
      stock: 0,
      newestTime: 0,
    };

    current.count += 1;
    current.stock += Number(product?.stock) || 0;
    current.newestTime = Math.max(current.newestTime, new Date(product?.createdAt || 0).getTime());
    categoryMap.set(category, current);
  });

  const topCategories = Array.from(categoryMap.values())
    .sort((first, second) => second.count - first.count || second.stock - first.stock || first.name.localeCompare(second.name))
    .slice(0, 2);

  const newestCategory = Array.from(categoryMap.values()).sort((first, second) => second.newestTime - first.newestTime)[0];
  const availability = products.length ? Math.round((availableProducts.length / products.length) * 100) : 0;

  return {
    totalProducts: products.length,
    totalCategories: categoryMap.size,
    availableProducts: availableProducts.length,
    offerProducts: offerProducts.length,
    topCategories,
    newestCategory,
    availability,
  };
}

function CategoryMetricCard({ category, variant = "cyan" }) {
  const isFuchsia = variant === "fuchsia";
  const gradientClass = isFuchsia ? "from-fuchsia-400 to-rose-500" : "from-cyan-400 to-blue-600";
  const badgeClass = isFuchsia ? "bg-fuchsia-400/10 text-fuchsia-300" : "bg-cyan-400/10 text-cyan-300";
  const stockWidth = `${Math.min(100, Math.max(24, category.stock || category.count * 10))}%`;
  const countWidth = `${Math.min(92, Math.max(36, category.count * 18))}%`;

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-sm font-medium text-slate-300">{category.name}</span>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
          {formatCount(category.count)}
        </span>
      </div>
      <div className={`mt-4 h-2 rounded-full bg-gradient-to-r ${gradientClass}`} style={{ width: stockWidth }} />
      <div className="mt-3 h-2 rounded-full bg-white/10" style={{ width: countWidth }} />
      <div className="mt-2 h-2 w-2/3 rounded-full bg-white/10" />
    </div>
  );
}

export default function Hero({ products = [], loading = false }) {
  const metrics = getHeroMetrics(products);
  const categoryCards =
    metrics.topCategories.length > 0
      ? metrics.topCategories
      : [
          { name: loading ? "Loading products" : "No products yet", count: 0, stock: 0 },
          { name: "Categories", count: metrics.totalCategories, stock: 0 },
        ];
  const trendingLabel = metrics.topCategories.map((category) => category.name).join(" + ") || "Catalog";
  const heroStats = [
    { value: formatCount(metrics.totalProducts), label: "Live products" },
    { value: formatCount(metrics.totalCategories), label: "Categories" },
    { value: formatCount(metrics.availableProducts), label: "In stock" },
  ];

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_30%)]" />
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl animate-float" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            Modern accessories for everyday tech lovers
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
            Upgrade Your Tech Lifestyle
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Discover premium headphones, smart wearables, and essential gadgets curated for fast-paced
            digital lives. Clean design, sharp performance, and reliable quality in one place.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20"
            >
              Shop Now
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:border-cyan-400/30 hover:bg-white/10"
            >
              Explore
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-slate-950/30 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center animate-fade-in-up">
          <div className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-sm">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-400/10 via-transparent to-indigo-500/10" />

            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Curated drop</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    {metrics.totalProducts ? "Live catalog, neatly organized" : "Products will appear here live"}
                  </h2>
                </div>
                <div className="rounded-2xl bg-cyan-400/10 px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Trending now</p>
                  <p className="mt-1 text-lg font-semibold text-white">{trendingLabel}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <CategoryMetricCard category={categoryCards[0]} />
                <CategoryMetricCard category={categoryCards[1]} variant="fuchsia" />
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {metrics.offerProducts ? `${formatCount(metrics.offerProducts)} live deal products` : "Live inventory from TechKhor sellers"}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {metrics.newestCategory
                        ? `Newest listings are coming from ${metrics.newestCategory.name}.`
                        : "Add approved products to make this panel update automatically."}
                    </p>
                  </div>
                  <div className="hidden rounded-2xl bg-emerald-400/10 px-4 py-3 text-center sm:block">
                    <p className="text-2xl font-black text-emerald-300">{metrics.availability}%</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">In stock</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
