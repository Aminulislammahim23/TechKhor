import Card from "../components/Card";
import OrdersChart from "../components/OrdersChart";
import ProductChart from "../components/ProductChart";
import RevenueChart from "../components/RevenueChart";
import UsersChart from "../components/UsersChart";
import { useEffect, useState } from "react";
import { getDashboardAnalytics } from "../api/analytics.api";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({
    cards: [],
    revenueData: [],
    ordersData: [],
    productStatusData: [],
    usersData: [],
    analyticsSummary: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getDashboardAnalytics();
        if (mounted) {
          setAnalytics(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || "Failed to load live dashboard data.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const timer = window.setTimeout(loadAnalytics, 450);

    return () => {
      mounted = false;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {loading && analytics.cards.length === 0
          ? Array.from({ length: 4 }).map((_, index) => (
              <article
                key={index}
                className="animate-pulse rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30"
              >
                <div className="mb-5 h-12 w-12 rounded-2xl bg-white/10" />
                <div className="h-4 w-32 rounded-full bg-white/10" />
                <div className="mt-4 h-8 w-24 rounded-full bg-white/10" />
                <div className="mt-4 h-4 w-28 rounded-full bg-white/10" />
              </article>
            ))
          : analytics.cards.map((item) => <Card key={item.title} {...item} />)}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={analytics.revenueData} loading={loading} />
        <OrdersChart data={analytics.ordersData} loading={loading} />
        <ProductChart data={analytics.productStatusData} loading={loading} />
        <UsersChart data={analytics.usersData} loading={loading} />
      </section>

      <section className="grid gap-6 xl:grid-cols-4">
        {analytics.analyticsSummary.map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-400/20"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
