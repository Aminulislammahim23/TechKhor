import { useEffect, useMemo, useState } from "react";
import { getProducts, normalizeApiError, updateProduct } from "../api";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUserIdFromToken } from "../utils/jwt";

function unwrapProducts(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "BDT 0";

  return `BDT ${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(number)}`;
}

export default function SellerOfferProduct() {
  const { token } = useAuth();
  const sellerId = getCurrentUserIdFromToken(token);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sellerProducts = useMemo(
    () =>
      products.filter((product) => Number(product?.seller?.id) === Number(sellerId)),
    [products, sellerId]
  );

  const activeOffers = useMemo(
    () => sellerProducts.filter((product) => product?.isOffer && Number(product?.offerPrice) > 0),
    [sellerProducts]
  );

  const selectedProduct = useMemo(
    () => sellerProducts.find((product) => String(product.id || product._id) === selectedProductId),
    [sellerProducts, selectedProductId]
  );

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      if (!sellerId) return;

      try {
        setLoading(true);
        setError("");
        const response = await getProducts({ limit: 200 });
        if (active) {
          const list = unwrapProducts(response.data);
          setProducts(list);
          const ownProducts = list.filter((product) => Number(product?.seller?.id) === Number(sellerId));
          setSelectedProductId((current) => current || String(ownProducts[0]?.id || ""));
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
  }, [sellerId]);

  useEffect(() => {
    if (!selectedProduct) {
      setOfferPrice("");
      return;
    }

    setOfferPrice(selectedProduct?.isOffer && selectedProduct?.offerPrice ? String(selectedProduct.offerPrice) : "");
  }, [selectedProduct]);

  const updateProductInState = (updatedProduct) => {
    setProducts((current) =>
      current.map((product) =>
        Number(product.id || product._id) === Number(updatedProduct.id || updatedProduct._id)
          ? { ...product, ...updatedProduct }
          : product
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedProduct) {
      setError("Select a product first.");
      return;
    }

    const price = Number(offerPrice);
    const originalPrice = Number(selectedProduct.price);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Offer price must be greater than 0.");
      return;
    }

    if (Number.isFinite(originalPrice) && price >= originalPrice) {
      setError("Offer price must be lower than the regular price.");
      return;
    }

    try {
      setSaving(true);
      const response = await updateProduct(selectedProduct.id || selectedProduct._id, {
        isOffer: true,
        offerPrice: price,
      });
      updateProductInState(response.data);
      setSuccess("Offer price saved. Approved offer products appear in Best Deals.");
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleClearOffer = async (product) => {
    setError("");
    setSuccess("");

    try {
      setSaving(true);
      const response = await updateProduct(product.id || product._id, {
        isOffer: false,
      });
      updateProductInState(response.data);
      setSuccess("Offer removed.");
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setSaving(false);
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

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Best deals</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Set offer price</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Select one of your products and add a lower offer price for the landing page deals section.
          </p>

          <div className="mt-6 space-y-5">
            <label className="block text-sm font-medium text-slate-300">
              Product
              <select
                value={selectedProductId}
                onChange={(event) => setSelectedProductId(event.target.value)}
                disabled={loading || sellerProducts.length === 0}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-70"
              >
                {sellerProducts.map((product) => (
                  <option key={product.id || product._id} value={product.id || product._id}>
                    {product.name} - {formatPrice(product.price)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-300">
              Offer price
              <input
                value={offerPrice}
                onChange={(event) => setOfferPrice(event.target.value)}
                type="number"
                min="1"
                placeholder="Enter offer price"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              />
            </label>

            {selectedProduct ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                <p>
                  Regular price: <span className="font-semibold text-white">{formatPrice(selectedProduct.price)}</span>
                </p>
                <p className="mt-2">
                  Status:{" "}
                  <span className={selectedProduct.isApproved ? "font-semibold text-emerald-300" : "font-semibold text-amber-300"}>
                    {selectedProduct.isApproved ? "Approved" : "Pending approval"}
                  </span>
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={saving || loading || sellerProducts.length === 0}
              className="w-full rounded-2xl bg-cyan-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
            >
              {saving ? "Saving..." : "Save Offer"}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Active</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Offer products</h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300">{activeOffers.length}</span>
          </div>

          {loading ? (
            <p className="py-8 text-slate-300">Loading products...</p>
          ) : null}

          {!loading && sellerProducts.length === 0 ? (
            <p className="py-8 text-slate-300">No products found. Add a product first.</p>
          ) : null}

          {!loading && sellerProducts.length > 0 && activeOffers.length === 0 ? (
            <p className="py-8 text-slate-300">No offer products yet.</p>
          ) : null}

          <div className="divide-y divide-white/10">
            {activeOffers.map((product) => (
              <div key={product.id || product._id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-semibold text-white">{product.name}</h4>
                  <p className="mt-1 text-sm text-slate-400">
                    <span className="line-through">{formatPrice(product.price)}</span>{" "}
                    <span className="font-semibold text-cyan-300">{formatPrice(product.offerPrice)}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleClearOffer(product)}
                  disabled={saving}
                  className="w-fit rounded-full border border-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Remove offer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
