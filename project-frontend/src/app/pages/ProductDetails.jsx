import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import TechVisual from "../components/TechVisual";
import ProductCard from "../components/ProductCard";
import { useProduct, useProducts } from "../hooks/useProducts";
import { addToCart } from "../utils/cart";

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "To be announced";

  return `BDT ${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(number)}`;
}

function getProductId(product) {
  return product?.id ?? product?._id;
}

function normalizeTextList(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value !== "string") return [];

  return value
    .split(/[\n,;|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function objectEntries(value) {
  if (!value || Array.isArray(value) || typeof value !== "object") return [];

  return Object.entries(value)
    .filter(([, fieldValue]) => fieldValue !== null && fieldValue !== undefined && String(fieldValue).trim() !== "")
    .map(([key, fieldValue]) => ({
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
        .trim(),
      value: Array.isArray(fieldValue) ? fieldValue.join(", ") : String(fieldValue),
    }));
}

function parseColonRows(text) {
  if (typeof text !== "string") return [];

  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.includes(":"))
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return {
        label: label.trim(),
        value: rest.join(":").trim(),
      };
    })
    .filter((row) => row.label && row.value);
}

function parseFeatureText(feature) {
  const text = String(feature || "").trim();
  if (!text.includes(":")) {
    return { label: "", value: text };
  }

  const [label, ...rest] = text.split(":");
  return {
    label: label.trim(),
    value: rest.join(":").trim(),
  };
}

function FeatureLine({ feature }) {
  const parsed = parseFeatureText(feature);

  return (
    <p className="text-slate-300">
      {parsed.label ? (
        <>
          <span className="font-semibold text-white">{parsed.label}:</span> {parsed.value}
        </>
      ) : (
        parsed.value
      )}
    </p>
  );
}

function inferFeatureRows(product) {
  const tags = normalizeTextList(product?.tags);
  const rows = [];

  if (product?.brand) rows.unshift({ label: "Brand", value: product.brand });
  if (product?.model) rows.unshift({ label: "Model", value: product.model });
  if (tags.length > 0) rows.push({ label: "Tags", value: tags.join(", ") });
  if (product?.rating) rows.push({ label: "Rating", value: `${product.rating}/5` });

  return rows;
}

function buildSpecRows(product) {
  const explicitSpecs = [
    ...objectEntries(product?.specifications),
    ...objectEntries(product?.specs),
    ...objectEntries(product?.attributes),
    ...parseColonRows(product?.description),
  ];

  const baseRows = [
    { label: "Product Code", value: getProductId(product) },
    { label: "Product Type", value: product?.category?.name || product?.categoryName || "General product" },
    { label: "Brand", value: product?.brand || product?.manufacturer },
    { label: "Model", value: product?.model },
    { label: "Warranty", value: product?.warranty },
  ].filter((row) => row.value !== null && row.value !== undefined && String(row.value).trim() !== "");

  const seen = new Set();
  return [...explicitSpecs, ...baseRows].filter((row) => {
    const key = row.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getGallery(product) {
  const images = [
    product?.image,
    ...(Array.isArray(product?.images) ? product.images : []),
    ...(Array.isArray(product?.gallery) ? product.gallery : []),
  ].filter(Boolean);

  return [...new Set(images)];
}

export default function ProductDetails() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { products } = useProducts({ params: { limit: 6 }, enabled: Boolean(product) });
  const [cartMessage, setCartMessage] = useState("");
  const [activeImage, setActiveImage] = useState("");

  const gallery = useMemo(() => getGallery(product || {}), [product]);
  const selectedImage = activeImage || gallery[0];
  const keyFeatures = useMemo(() => inferFeatureRows(product || {}), [product]);
  const specRows = useMemo(() => buildSpecRows(product || {}), [product]);
  const sellerFeatureBullets = normalizeTextList(product?.keyFeatures || product?.features);
  const featureBullets =
    sellerFeatureBullets.length > 0
      ? sellerFeatureBullets
      : normalizeTextList(product?.category?.keyFeatures);
  const productId = getProductId(product);
  const inStock = Number(product?.stock ?? 0) > 0;
  const regularPrice = Number(product?.price);
  const offerPrice = Number(product?.offerPrice);
  const hasOffer = Boolean(product?.isOffer) && Number.isFinite(offerPrice) && offerPrice > 0 && offerPrice < regularPrice;

  const similarProducts = useMemo(() => {
    if (!product) return [];
    const currentCategory = product?.category?.id || product?.category?.name;

    return products
      .filter((item) => getProductId(item) !== productId)
      .filter((item) => {
        if (!currentCategory) return true;
        return item?.category?.id === currentCategory || item?.category?.name === currentCategory;
      })
      .slice(0, 3);
  }, [product, productId, products]);

  const handleAddToCart = () => {
    if (!product || !inStock) return;
    addToCart({ ...product, id: productId });
    setCartMessage("Added to cart.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <main className="mx-auto max-w-7xl px-4 py-20 text-slate-300 sm:px-6 lg:px-8">Loading product...</main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-950">
        <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-rose-100">
            {error || "Product not found."}
          </div>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 font-semibold text-slate-950">
            Back to Products
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/products" className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-100">
          Back to Products
        </Link>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-slate-950/40">
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} className="h-[420px] w-full rounded-2xl object-contain bg-white" />
              ) : (
                <TechVisual variant={product?.variant || "hero"} className="h-[420px]" />
              )}
            </div>

            {gallery.length > 1 ? (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {gallery.map((image) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={`h-20 w-24 shrink-0 overflow-hidden rounded-2xl border bg-white p-1 transition ${
                      selectedImage === image ? "border-cyan-300" : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={image} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                {product?.category?.name || "Product details"}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">{product.name}</h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
                Price: <strong className="text-white">{formatPrice(hasOffer ? offerPrice : product.price)}</strong>
                {hasOffer ? <span className="ml-2 text-slate-400 line-through">{formatPrice(product.price)}</span> : null}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
                Status: <strong className={inStock ? "text-emerald-300" : "text-rose-300"}>{inStock ? "In Stock" : "Out of Stock"}</strong>
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
                Stock: <strong className="text-white">{Number(product?.stock ?? 0).toLocaleString("en-BD")}</strong>
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
                Product Code: <strong className="text-white">{productId}</strong>
              </span>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-bold text-white">Key Features</h2>
              <div className="mt-5 space-y-3">
                {keyFeatures.map((feature) => (
                  <p key={feature.label} className="text-slate-300">
                    <span className="font-semibold text-white">{feature.label}:</span> {feature.value}
                  </p>
                ))}
                {featureBullets.map((feature) => (
                  <FeatureLine key={feature} feature={feature} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
              >
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <Link
                to="/cart"
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 px-5 py-3.5 font-semibold text-white transition hover:bg-white/5"
              >
                View Cart
              </Link>
            </div>
            {cartMessage ? <p className="text-sm font-semibold text-emerald-300">{cartMessage}</p> : null}
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">Specification</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <div className="bg-white/10 px-5 py-4 font-semibold text-cyan-200">Product Details</div>
              {specRows.length > 0 ? (
                <div className="divide-y divide-white/10">
                  {specRows.map((row) => (
                    <div key={row.label} className="grid gap-2 px-5 py-4 text-sm sm:grid-cols-[220px_1fr]">
                      <span className="text-slate-400">{row.label}</span>
                      <span className="font-medium text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-5 text-slate-400">No specification details added for this product yet.</p>
              )}
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-center text-2xl font-bold text-white">Similar Product</h2>
            <div className="mt-5 space-y-5">
              {similarProducts.length > 0 ? (
                similarProducts.map((item) => (
                  <ProductCard key={getProductId(item)} product={item} />
                ))
              ) : (
                <p className="rounded-2xl bg-slate-950/60 p-5 text-sm leading-6 text-slate-400">
                  Similar products will appear here when more items are available in this category.
                </p>
              )}
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
