import Card from "../components/Card";
import OrdersChart from "../components/OrdersChart";
import ProductChart from "../components/ProductChart";
import RevenueChart from "../components/RevenueChart";
import UsersChart from "../components/UsersChart";
import { useEffect, useState } from "react";
import { dashboardStats } from "../data/adminData";
import { getDashboardAnalytics } from "../api/analytics.api";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({
    revenueData: [],
    ordersData: [],
    productStatusData: [],
    usersData: [],
    analyticsSummary: [],
  });
  const [loading, setLoading] = useState(true);
  const summaryCards =
    analytics.analyticsSummary.length > 0
      ? analytics.analyticsSummary
      : [
          { label: "Revenue growth", value: "+21.8%" },
          { label: "Order volume", value: "+12.7%" },
          { label: "Product approvals", value: "72%" },
          { label: "User growth", value: "+18.2%" },
        ];

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getDashboardAnalytics();
        if (mounted) {
          setAnalytics(data);
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
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <Card key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={analytics.revenueData} loading={loading} />
        <OrdersChart data={analytics.ordersData} loading={loading} />
        <ProductChart data={analytics.productStatusData} loading={loading} />
        <UsersChart data={analytics.usersData} loading={loading} />
      </section>

      <section className="grid gap-6 xl:grid-cols-4">
        {summaryCards.map((metric) => (
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
