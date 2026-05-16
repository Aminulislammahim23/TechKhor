import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronUp, Filter, X } from "lucide-react";
import ProductCard from "../components/ProductCard";

const fallbackProducts = [
  {
    id: 1,
    name: "Gigasonic RDA-1707W 17 Inch LED Square Monitor",
    description: "Compact LED square monitor for home, office, and entry-level desktop setups.",
    price: 4800,
    isOffer: true,
    offerPrice: 4400,
    stock: 18,
    isApproved: true,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
    rating: 4,
    tags: "monitor, led, office, gigasonic",
    keyFeatures: [
      "Maximum Resolution: 1600 x 900p",
      "Display: LED, 60Hz, 5ms",
      "Ports: 1x HDMI, 1x VGA",
      "Color Support: 16.7 million colors with the use of FRC",
    ],
    createdAt: "2026-05-10T10:00:00.000Z",
    seller: { id: 1, name: "Techkhor Store" },
    category: { id: 1, name: "Monitor" },
  },
  {
    id: 2,
    name: 'Gigasonic RB-G185S-300C 18.5" HD LED Monitor',
    description: "HD LED monitor with slim profile, low power usage, and reliable display output.",
    price: 5900,
    isOffer: true,
    offerPrice: 5550,
    stock: 9,
    isApproved: true,
    image:
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    tags: "monitor, hd, led, gigasonic",
    keyFeatures: [
      "Resolution: HD (1600 x 900)",
      "Display: LED, 60Hz, 5ms",
      "Ports: 1x HDMI, 1x VGA",
      "Aspect Ratio: 16:9, Brightness: 200 nits",
    ],
    createdAt: "2026-05-09T10:00:00.000Z",
    seller: { id: 1, name: "Techkhor Store" },
    category: { id: 1, name: "Monitor" },
  },
  {
    id: 3,
    name: 'Gigasonic RB-G19S-300C 19" HD LED Monitor',
    description: "Affordable HD monitor for everyday browsing, learning, and business use.",
    price: 5800,
    isOffer: true,
    offerPrice: 5600,
    stock: 5,
    isApproved: true,
    image:
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80",
    rating: 4,
    tags: "monitor, hd, vga, hdmi",
    keyFeatures: [
      "Resolution: HD (1366x768)",
      "Display: TFT, 60Hz, 5ms",
      "Ports: 1x HDMI, 1x VGA",
      "Aspect Ratio: 16:9, Brightness: 200 nits",
    ],
    createdAt: "2026-05-08T10:00:00.000Z",
    seller: { id: 2, name: "Monitor World" },
    category: { id: 1, name: "Monitor" },
  },
  {
    id: 4,
    name: "Gigasonic RB-G20S-400C 20 Inch HD LED Monitor",
    description: "Wide HD LED monitor with rich colors and smooth refresh for daily productivity.",
    price: 6500,
    isOffer: true,
    offerPrice: 5990,
    stock: 14,
    isApproved: true,
    image:
      "https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=600&q=80",
    rating: 4,
    tags: "monitor, hd, led, display",
    keyFeatures: [
      "Resolution: HD (1366x768)",
      "Display: LED, 60Hz, 5ms",
      "Ports: 1x HDMI, 1x VGA",
      "Color Support: 16.7 million (6 bits +2 bits scalar FRC)",
    ],
    createdAt: "2026-05-07T10:00:00.000Z",
    seller: { id: 2, name: "Monitor World" },
    category: { id: 1, name: "Monitor" },
  },
];

const availability = ["In Stock", "Pre Order", "Up Coming"];
const brands = ["MSI", "AOC", "BenQ", "Asus", "Acer", "Dell", "XIAOMI", "HP", "GIGABYTE", "LG"];
const categories = [
  "Gigabyte",
  "Samsung",
  "Acer",
  "Thermaltake",
  "Dahua",
  "PC Power",
  "Titan Army",
  "Apple",
  "Value-Top",
  "Gigasonic",
  "TrendSonic",
  "Smart",
  "Gaming Monitor",
  "Portable Monitor",
  "Monitor Arm",
];

function FilterSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-slate-950/20">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <h2 className="font-semibold text-slate-100">{title}</h2>
        <ChevronUp size={18} className="text-slate-400" />
      </div>
      <div className="space-y-3 px-5 py-4">{children}</div>
    </div>
  );
}

function CheckboxList({ items }) {
  return items.map((item) => (
    <label key={item} className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
      <input type="checkbox" className="checkbox checkbox-sm rounded border-slate-600 bg-slate-950" />
      <span>{item}</span>
    </label>
  ));
}

function PriceRange({ minPrice, maxPrice, maxLimit, onMinChange, onMaxChange }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-slate-950/20">
      <h2 className="border-b border-slate-800 px-5 py-4 font-semibold text-slate-100">
        Price Range
      </h2>
      <div className="px-5 py-8">
        <input
          type="range"
          min="0"
          max={maxLimit}
          value={maxPrice}
          onChange={(event) => onMaxChange(event.target.value)}
          className="range range-error range-xs"
        />
        <div className="mt-7 flex items-center justify-between gap-4">
          <input
            type="text"
            value={formatPrice(minPrice)}
            onChange={(event) => onMinChange(event.target.value)}
            className="h-9 w-24 rounded-lg border border-slate-700 bg-slate-950 text-center text-sm text-slate-100"
          />
          <input
            type="text"
            value={formatPrice(maxPrice)}
            onChange={(event) => onMaxChange(event.target.value)}
            className="h-9 w-24 rounded-lg border border-slate-700 bg-slate-950 text-center text-sm text-slate-100"
          />
        </div>
      </div>
    </div>
  );
}

function FilterContent({ priceRange, onMinPriceChange, onMaxPriceChange, maxPriceLimit }) {
  return (
    <>
      <PriceRange
        minPrice={priceRange.min}
        maxPrice={priceRange.max}
        maxLimit={maxPriceLimit}
        onMinChange={onMinPriceChange}
        onMaxChange={onMaxPriceChange}
      />

      <FilterSection title="Availability">
        <CheckboxList items={availability} />
      </FilterSection>

      <FilterSection title="Brand">
        <div className="max-h-80 space-y-3 overflow-y-auto pr-2">
          <CheckboxList items={brands} />
        </div>
      </FilterSection>
    </>
  );
}

function formatPrice(price) {
  return Number(price).toLocaleString();
}

function parsePrice(value) {
  const numericValue = Number(String(value).replace(/,/g, ""));

  return Number.isFinite(numericValue) ? numericValue : 0;
}

function getDisplayPrice(product) {
  return product.isOffer && product.offerPrice ? product.offerPrice : product.price;
}

function normalizeProducts(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

export default function Product() {
  const { category } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState(fallbackProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const maxPriceLimit = useMemo(() => {
    if (!products.length) {
      return 0;
    }

    return Math.max(...products.map((product) => Number(getDisplayPrice(product)) || 0));
  }, [products]);
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: maxPriceLimit,
  });

  useEffect(() => {
    const controller = new AbortController();
    const url = category
      ? `http://localhost:5010/api/products?category=${encodeURIComponent(category)}`
      : "http://localhost:5010/api/products";

    setIsLoading(true);
    setFetchError("");

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        return res.json();
      })
      .then((data) => {
        const nextProducts = normalizeProducts(data);
        setProducts(nextProducts);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.log(err);
          setFetchError("Could not load products from server. Showing local products.");
          setProducts(fallbackProducts);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [category]);

  useEffect(() => {
    setPriceRange({
      min: 0,
      max: maxPriceLimit,
    });
  }, [maxPriceLimit]);

  const handleMinPriceChange = (value) => {
    const nextMin = Math.min(parsePrice(value), priceRange.max);

    setPriceRange((currentRange) => ({
      ...currentRange,
      min: Math.max(nextMin, 0),
    }));
  };

  const handleMaxPriceChange = (value) => {
    const nextMax = Math.max(parsePrice(value), priceRange.min);

    setPriceRange((currentRange) => ({
      ...currentRange,
      max: Math.min(nextMax, maxPriceLimit),
    }));
  };

  const filteredProducts = products.filter((product) => {
    const productPrice = getDisplayPrice(product);

    return productPrice >= priceRange.min && productPrice <= priceRange.max;
  });
  const pageTitle = category ? `${category} Products` : "All Products";

  return (
    <section className="-mx-6 -mb-6 min-h-screen bg-slate-950 px-4 pb-8 text-slate-100 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Techkhor Catalog
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            {pageTitle}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Browse approved products with live stock, offer pricing, ratings, and key product details.
          </p>
        </div>

        <div className="hidden items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-2 lg:flex">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <span>Show:</span>
            <select className="select select-sm h-9 min-h-9 border border-slate-700 bg-slate-950 text-slate-100">
              <option>20</option>
              <option>40</option>
              <option>60</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <span>Sort By:</span>
            <select className="select select-sm h-9 min-h-9 border border-slate-700 bg-slate-950 text-slate-100">
              <option>Default</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mb-5 lg:hidden">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className="btn btn-outline btn-sm h-8 min-h-8 shrink-0 rounded-full border-slate-700 bg-slate-900/80 px-3 text-xs font-normal text-slate-200"
            >
              {category}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="btn h-12 min-h-12 rounded-xl border border-slate-800 bg-slate-900 px-6 text-slate-100 shadow-lg"
        >
          <Filter size={20} />
          Filter
        </button>
      </div>

      {isFilterOpen && (
        <button
          type="button"
          aria-label="Close filter overlay"
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-x-0 bottom-0 top-16 z-[80] bg-black/45 lg:hidden"
        />
      )}

      <div className="grid gap-5 lg:grid-cols-[266px_1fr]">
        <aside
          className={`fixed bottom-0 right-0 top-16 z-[90] w-[58vw] min-w-[284px] max-w-[340px] overflow-y-auto bg-slate-950/95 p-3 shadow-2xl backdrop-blur-md transition-transform duration-300 lg:static lg:z-auto lg:w-auto lg:min-w-0 lg:max-w-none lg:translate-x-0 lg:space-y-3 lg:bg-transparent lg:p-0 lg:shadow-none ${
            isFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsFilterOpen(false)}
            className="btn btn-circle btn-sm absolute -left-10 top-2 border border-slate-700 bg-slate-900 text-slate-100 shadow lg:hidden"
          >
            <X size={18} />
          </button>

          <div className="space-y-3">
            <FilterContent
              priceRange={priceRange}
              maxPriceLimit={maxPriceLimit}
              onMinPriceChange={handleMinPriceChange}
              onMaxPriceChange={handleMaxPriceChange}
            />
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4 shadow-lg shadow-slate-950/20">
            <div>
              <h2 className="font-semibold text-white">
                {category ? `Featured ${category}` : "Featured Products"}
              </h2>
              <p className="text-sm text-slate-400">
                {isLoading ? "Loading products..." : `${filteredProducts.length} products found`}
              </p>
            </div>
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
              Approved only
            </span>
          </div>

          {fetchError && (
            <div className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-3 text-sm text-amber-200">
              {fetchError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {!isLoading && filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-12 text-center text-slate-400">
              No products found in this price range.
            </div>
          )}
        </div>
      </div>

      <button className="fixed bottom-24 right-6 z-[70] flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold uppercase leading-tight text-white shadow-xl lg:hidden">
        Eid Deal
      </button>
    </section>
  );
}
