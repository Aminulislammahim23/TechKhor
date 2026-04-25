import { useEffect, useState } from "react";
import Table, { StatusPill } from "../components/Table";
import { normalizeApiError } from "../api";
import { approveProduct as approveProductApi, getProducts } from "../api/product.api";

function formatPrice(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return "$0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(number);
}

function unwrapProducts(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

function mapProductRow(product) {
  return {
    id: product.id,
    name: product.name || "-",
    price: formatPrice(product.price),
    seller: product?.seller?.fullName || product?.seller?.name || "N/A",
    status: product?.isApproved ? "Approved" : "Pending",
  };
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const response = await getProducts();

        if (active) {
          const rows = unwrapProducts(response.data).map(mapProductRow);
          setProducts(rows);
        }
      } catch (err) {
        if (active) {
          setProducts([]);
          setError(normalizeApiError(err));
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
  }, []);

  const approveProduct = async (productId) => {
    try {
      setApprovingId(productId);
      await approveProductApi(productId);

      setProducts((current) =>
        current.map((product) =>
          product.id === productId ? { ...product, status: "Approved" } : product
        )
      );
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setApprovingId(null);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    { key: "seller", label: "Seller" },
    {
      key: "status",
          label: "Status",
      render: (row) => (
        <div className="flex flex-col gap-3">
          <StatusPill status={row.status} />
          {row.status === "Pending" ? (
            <button
              type="button"
              onClick={() => approveProduct(row.id)}
              disabled={approvingId === row.id}
              className="w-fit rounded-xl bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {approvingId === row.id ? "Approving..." : "Approve Product"}
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Product Review</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Approve product submissions quickly</h3>
          </div>
          <span className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-300 ring-1 ring-white/10">
            {products.filter((product) => product.status === "Pending").length} pending
          </span>
        </div>
      </div>

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

      <Table columns={columns} data={products} rowKey="id" />
    </section>
  );
}
