import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { addToCart } from "../utils/cart";
import { getProducts, normalizeApiError } from "../api";

function unwrapProducts(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

function normalizeValue(value) {
  return String(value || "").trim().toLowerCase();
}

function matchesCategory(product, categoryName, categoryId) {
  if (!categoryName && !categoryId) return true;

  const productCategoryId = String(product?.category?.id ?? product?.categoryId ?? "");
  const productCategoryName = normalizeValue(product?.category?.name ?? product?.categoryName);
  const requestedName = normalizeValue(categoryName);
  const requestedId = String(categoryId || "");

  return (
    (requestedId && productCategoryId === requestedId) ||
    (requestedName && productCategoryName === requestedName)
  );
}

export default function StoreProducts({ bestDealsOnly = false }) {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const selectedCategoryId = searchParams.get("categoryId") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const successTimerRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const response = await getProducts({
          limit: 100,
          category: selectedCategory,
          categoryId: selectedCategoryId,
          approvedOnly: bestDealsOnly ? true : undefined,
          offerOnly: bestDealsOnly ? true : undefined,
        });

        if (active) {
          const allProducts = unwrapProducts(response.data);
          const categoryProducts = allProducts.filter((product) =>
              matchesCategory(product, selectedCategory, selectedCategoryId)
            );
          setProducts(
            bestDealsOnly
              ? categoryProducts.filter((product) => product?.isOffer && Number(product?.offerPrice) > 0)
              : categoryProducts
          );
        }
      } catch (err) {
        if (active) {
          setError(normalizeApiError(err));
          setProducts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [bestDealsOnly, selectedCategory, selectedCategoryId]);

  useEffect(() => () => {
    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setSuccess(`${product.name} added to cart.`);

    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }

    successTimerRef.current = window.setTimeout(() => setSuccess(""), 2500);
  };

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) =>
      [
        product.id,
        product._id,
        product.name,
        product?.category?.name,
        product.categoryName,
      ].some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [products, searchTerm]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              {bestDealsOnly ? "Seller offers" : "Catalog"}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {bestDealsOnly ? "Best Deals" : selectedCategory ? selectedCategory : "Products"}
            </h1>
          </div>
          {selectedCategory || bestDealsOnly ? (
            <Link
              to="/products"
              className="w-fit rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/5"
            >
              {bestDealsOnly ? "All Products" : "All Products"}
            </Link>
          ) : null}
        </div>
        <p className="mt-4 max-w-2xl text-slate-400">
          {bestDealsOnly
            ? "Browse approved offer products selected from seller dashboards."
            : selectedCategory
            ? `Browse ${selectedCategory} products and add your favorites to the cart.`
            : "Browse the live TechKhor catalog and add items to your cart before placing an order."}
        </p>
        <label className="mt-6 block max-w-2xl">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by product ID, name, or category..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />
        </label>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
          Loading products...
        </div>
      ) : null}

      {!loading && filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
          {searchTerm.trim()
            ? "No products match your search."
            : bestDealsOnly
            ? "No seller offer products are available right now."
            : selectedCategory
            ? `No products are available in ${selectedCategory} right now.`
            : "No products are available right now."}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </section>
  );
}
