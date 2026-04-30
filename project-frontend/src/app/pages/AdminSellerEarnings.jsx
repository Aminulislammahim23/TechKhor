import { useEffect, useMemo, useState } from "react";
import Table, { StatusPill } from "../components/Table";
import { getAdminSellerEarnings, normalizeApiError } from "../api";

function formatAmount(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "BDT 0";

  return `BDT ${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(numeric)}`;
}

function formatDate(value) {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function mapPayoutStatus(status) {
  return String(status || "").toLowerCase() === "paid" ? "Paid" : "Pending";
}

export default function AdminSellerEarnings() {
  const [earnings, setEarnings] = useState([]);
  const [summary, setSummary] = useState({
    totalEarning: 0,
    monthlyEarning: 0,
    pendingPayout: 0,
    paidPayout: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEarnings() {
      try {
        setLoading(true);
        setError("");
        const response = await getAdminSellerEarnings();

        if (!active) return;

        setEarnings(Array.isArray(response.data?.earnings) ? response.data.earnings : []);
        setSummary(response.data?.summary || {});
      } catch (err) {
        if (active) {
          setEarnings([]);
          setError(normalizeApiError(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEarnings();

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    { title: "Total Earning", value: formatAmount(summary.totalEarning) },
    { title: "Monthly Earning", value: formatAmount(summary.monthlyEarning) },
    { title: "Pending Payout", value: formatAmount(summary.pendingPayout) },
    { title: "Paid Payout", value: formatAmount(summary.paidPayout) },
  ];

  const rows = useMemo(
    () =>
      earnings.map((earning) => ({
        id: earning.id,
        seller: earning?.seller?.fullName || earning?.seller?.email || "N/A",
        orderId: earning?.order?.id ? `ORD-${earning.order.id}` : "N/A",
        totalSale: formatAmount(earning.totalSale),
        platformCommission: formatAmount(earning.platformCommission),
        sellerAmount: formatAmount(earning.sellerAmount),
        payoutStatus: mapPayoutStatus(earning.payoutStatus),
        createdAt: formatDate(earning.createdAt),
      })),
    [earnings]
  );

  const columns = [
    { key: "seller", label: "Seller" },
    { key: "orderId", label: "Order" },
    { key: "totalSale", label: "Total Sale" },
    { key: "platformCommission", label: "Commission" },
    { key: "sellerAmount", label: "Seller Amount" },
    {
      key: "payoutStatus",
      label: "Payout",
      render: (row) => <StatusPill status={row.payoutStatus} />,
    },
    { key: "createdAt", label: "Date" },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">{item.title}</p>
            <p className="mt-3 text-2xl font-bold text-white">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-300 ring-1 ring-white/10">
          {rows.length} records
        </span>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          Loading seller earnings...
        </div>
      ) : null}

      {!loading && rows.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          No seller earnings found yet.
        </div>
      ) : null}

      <Table columns={columns} data={rows} rowKey="id" />
    </section>
  );
}
