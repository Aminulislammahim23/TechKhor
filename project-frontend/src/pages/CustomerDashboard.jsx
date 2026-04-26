import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import Table, { StatusPill } from "../components/Table";
import { getMyOrders } from "../api";
import { fallbackOrders } from "../data/customerDashboardData";

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
          setOrders(apiOrders.length > 0 ? apiOrders : fallbackOrders);
        }
      } catch {
        if (active) {
          setOrders(fallbackOrders);
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
        value: totalValue > 0 ? formatCurrency(totalValue) : "BDT 135,600",
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

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
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

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">Customer Status</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-950">Premium buyer</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Fast checkout, saved payment tracking, and priority support are ready whenever your next build starts.
          </p>
          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Support response</p>
              <p className="mt-1 font-semibold text-slate-950">Under 2 hours</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Saved address</p>
              <p className="mt-1 font-semibold text-slate-950">Dhaka, Bangladesh</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
