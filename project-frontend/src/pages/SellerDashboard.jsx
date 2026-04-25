import { useEffect, useMemo, useState } from "react";
import { getMyOrders, getProducts, normalizeApiError } from "../api";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUserIdFromToken } from "../utils/jwt";

function unwrapProducts(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

export default function SellerDashboard() {
  const { token } = useAuth();
  const sellerId = getCurrentUserIdFromToken(token);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [productsRes, ordersRes] = await Promise.all([getProducts({ limit: 200 }), getMyOrders()]);
        if (!active) return;

        const allProducts = unwrapProducts(productsRes.data);
        const mine = allProducts.filter((product) => Number(product?.seller?.id) === Number(sellerId));

        setProducts(mine);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      } catch (err) {
        if (active) {
          setError(normalizeApiError(err));
          setProducts([]);
          setOrders([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [sellerId]);

  const stats = useMemo(
    () => [
      {
        title: "My Products",
        value: products.length,
        hint: `${products.filter((item) => item.isApproved).length} approved`,
      },
      {
        title: "My Orders",
        value: orders.length,
        hint: "Filtering-ready for seller mapping",
      },
    ],
    [products, orders]
  );

  return (
    <section className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          Loading dashboard...
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {stats.map((card) => (
          <article key={card.title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">{card.title}</p>
            <p className="mt-3 text-4xl font-bold text-white">{card.value}</p>
            <p className="mt-2 text-sm text-slate-400">{card.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
