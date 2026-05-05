import { useEffect, useState } from "react";
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
    orderId: `ORD-${order.id}`,
    date: formatDate(order.createdAt),
    totalPrice: formatCurrency(order.totalPrice),
    status: normalizeStatus(order.status),
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          id: item.id || `${order.id}-${item.product?.id || item.productId || item.name || "item"}`,
          name: item.product?.name || item.name || "Product",
          quantity: Number(item.quantity || 0),
          price: formatCurrency(item.price || item.product?.price || 0),
          category: item.product?.category?.name || item.product?.category || item.category || "Product",
          image: item.product?.image || item.product?.imageUrl || item.image || "",
        }))
      : [],
  };
}

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const columns = [
    { key: "orderId", label: "Order ID" },
    { key: "date", label: "Date" },
    { key: "totalPrice", label: "Total Price" },
    { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-slate-950">Order History</h3>
          <p className="mt-1 text-sm text-slate-500">Review every order you have placed with TechKhor.</p>
        </div>
        <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          {orders.length} orders
        </span>
      </div>

      <Table
        columns={columns}
        data={orders}
        rowKey="id"
        loading={loading}
        variant="light"
        emptyTitle="No orders found"
        emptyDescription="Place an order from the store and it will show up here."
        renderRowActions={(row) => (
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
            onClick={() => setSelectedOrder(row)}
          >
            View Details
          </button>
        )}
      />

      {selectedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                  {selectedOrder.orderId}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Ordered Products</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedOrder.date} - {selectedOrder.totalPrice}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              {selectedOrder.items?.length ? (
                <div className="grid gap-4">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[72px_1fr_auto]"
                    >
                      <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Item
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-slate-950">{item.name}</h4>
                        <p className="mt-1 text-sm text-slate-500">{item.category}</p>
                        <p className="mt-2 text-sm font-medium text-slate-700">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-slate-500">Price</p>
                        <p className="mt-1 text-base font-semibold text-slate-950">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No product details found for this order.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
