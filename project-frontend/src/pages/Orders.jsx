import { useEffect, useMemo, useState } from "react";
import Table, { StatusPill } from "../components/Table";
import { getAdminOrders, normalizeApiError } from "../api";

function formatAmount(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "$0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numeric);
}

function mapStatus(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "paid") return "Delivered";
  if (normalized === "processing") return "Processing";
  if (normalized === "shipped") return "Shipped";
  return "Pending";
}

function toCsvValue(value) {
  const safe = String(value ?? "");
  return `"${safe.replace(/"/g, '""')}"`;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        setLoading(true);
        setError("");
        const response = await getAdminOrders();

        if (active) {
          setOrders(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (active) {
          setOrders([]);
          setError(normalizeApiError(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  const rows = useMemo(
    () =>
      orders.map((order) => ({
        id: order.id,
        orderId: `ORD-${order.id}`,
        user: order?.user?.fullName || order?.user?.name || "N/A",
        totalPrice: formatAmount(order.totalPrice),
        status: mapStatus(order.status),
        createdAt: order.createdAt || "",
      })),
    [orders]
  );

  const downloadCsv = () => {
    if (rows.length === 0) return;

    const headers = ["order_id", "user", "total_price", "status", "created_at"];
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        [
          toCsvValue(row.orderId),
          toCsvValue(row.user),
          toCsvValue(row.totalPrice),
          toCsvValue(row.status),
          toCsvValue(row.createdAt),
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns = [
    { key: "orderId", label: "Order ID" },
    { key: "user", label: "User" },
    { key: "totalPrice", label: "Total Price" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusPill status={row.status} />,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-300 ring-1 ring-white/10">
          {rows.length} records
        </span>
        <button
          type="button"
          onClick={downloadCsv}
          disabled={rows.length === 0}
          className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
        >
          Download CSV
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          Loading orders...
        </div>
      ) : null}

      <Table columns={columns} data={rows} rowKey="id" />
    </section>
  );
}
