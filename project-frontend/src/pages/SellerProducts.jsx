import { useEffect, useMemo, useState } from "react";
import Table, { StatusPill } from "../components/Table";
import { getProducts, normalizeApiError } from "../api";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUserIdFromToken } from "../utils/jwt";

function unwrapProducts(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

function formatPrice(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "BDT 0";
  return `BDT ${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(numeric)}`;
}

export default function SellerProducts() {
  const { token } = useAuth();
  const sellerId = getCurrentUserIdFromToken(token);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const response = await getProducts({ limit: 200 });
        if (!active) return;

        const mine = unwrapProducts(response.data).filter(
          (product) => Number(product?.seller?.id) === Number(sellerId)
        );

        setProducts(mine);
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

  const rows = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        name: product.name || "-",
        price: formatPrice(product.price),
        status: product.isApproved ? "Approved" : "Pending",
      })),
    [products]
  );

  const columns = [
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
  ];

  return (
    <section className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          Loading products...
        </div>
      ) : null}

      {!loading && rows.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          No products found. Add your first product.
        </div>
      ) : null}

      <Table columns={columns} data={rows} rowKey="id" />
    </section>
  );
}
