import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import Table, { StatusPill } from "../components/Table";
import { getMyOrders } from "../api";

function formatCurrency(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "BDT 0";

  return `BDT ${numeric.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
}

function formatDate(value) {
  if (!value) return "Today";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function normalizeStatus(status) {
  const normalized = String(status || "").toLowerCase();
  if (["paid", "completed", "delivered"].includes(normalized)) return "Completed";
  if (normalized === "shipped") return "Shipped";
  if (normalized === "processing") return "Processing";
  return "Pending";
}

function normalizeOrder(order) {
  return {
    id: order.id,
    orderId: order.orderId || `ORD-${order.id}`,
    date: order.date || formatDate(order.createdAt),
    totalPrice: order.totalPriceLabel || formatCurrency(order.totalPrice),
    totalValue: Number(order.totalPrice) || 0,
    status: normalizeStatus(order.status),
  };
}

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        setLoading(true);
        const response = await getMyOrders();
        const apiOrders = Array.isArray(response.data) ? response.data.map(normalizeOrder) : [];
        if (active) {
          setOrders(apiOrders);
        }
      } catch {
        if (active) {
          setOrders([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    const timer = window.setTimeout(loadOrders, 500);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  const summary = useMemo(() => {
    const totalValue = orders.reduce((sum, order) => sum + (order.totalValue || 0), 0);
    const completed = orders.filter((order) => order.status === "Completed").length;
    const pending = orders.filter((order) => order.status === "Pending").length;

    return [
      {
        title: "Total Orders",
        value: orders.length,
        change: "Across your TechKhor account",
        accent: "from-cyan-400 to-blue-500",
        icon: "O",
      },
      {
        title: "Total Spent",
        value: formatCurrency(totalValue),
        change: "Lifetime purchase value",
        accent: "from-emerald-400 to-teal-500",
        icon: "T",
      },
      {
        title: "Pending Orders",
        value: pending,
        change: "Awaiting confirmation or payment",
        accent: "from-amber-400 to-orange-500",
        icon: "P",
      },
      {
        title: "Completed Orders",
        value: completed,
        change: "Delivered or fully paid",
        accent: "from-violet-400 to-fuchsia-500",
        icon: "C",
      },
    ];
  }, [orders]);

  const columns = [
    { key: "orderId", label: "Order ID" },
    { key: "date", label: "Date" },
    { key: "totalPrice", label: "Total Price" },
    { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-48 animate-pulse rounded-2xl bg-white shadow-xl shadow-slate-200/70" />
            ))
          : summary.map((item) => <Card key={item.title} {...item} tone="light" />)}
      </section>

      <section>
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Recent Orders</h3>
              <p className="mt-1 text-sm text-slate-500">A quick view of your latest TechKhor purchases.</p>
            </div>
          </div>
          <Table
            columns={columns}
            data={orders.slice(0, 5)}
            rowKey="id"
            loading={loading}
            variant="light"
            emptyTitle="No orders yet"
            emptyDescription="Your recent orders will appear here after checkout."
            renderRowActions={(row) => (
              <button
                type="button"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
                onClick={() => window.alert(`Viewing ${row.orderId}`)}
              >
                View Details
              </button>
            )}
          />
        </div>
      </section>
    </div>
  );
}
