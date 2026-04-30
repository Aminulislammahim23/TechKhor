import { formatOrderDate, useOrders } from "../hooks/useOrders";

export default function MyOrders() {
  const { orders, loading, error } = useOrders();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Orders</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">My orders</h1>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
          Loading orders...
        </div>
      ) : null}

      {!loading && orders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
          No orders yet. Add products to your cart and place an order first.
        </div>
      ) : null}

      <div className="grid gap-6">
        {orders.map((order) => (
          <article key={order.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-400">Order #{order.id}</p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  BDT {Number(order.totalPrice).toLocaleString("en-BD")}
                </h2>
                <p className="mt-1 text-sm text-slate-400">Placed on {formatOrderDate(order.createdAt)}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${order.status === "paid" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {(order.items || []).map((item) => (
                <div key={item.id || `${order.id}-${item.product?.id}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">{item.product?.name || "Product"}</p>
                  <p className="mt-1">Quantity: {item.quantity}</p>
                  <p className="mt-1">Price: BDT {Number(item.price).toLocaleString("en-BD")}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
