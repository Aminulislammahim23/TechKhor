import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  ShoppingCart,
  Package,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { StatisticsChart } from "@/components/admin/StatisticsChart";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Dashboard" }],
  }),
  component: AdminDashboard,
});

interface Statistics {
  totalUsers: number;
  totalSellers: number;
  totalCustomers: number;
  totalProducts: number;
  pendingSellers: number;
  pendingProducts: number;
  bannedCustomers: number;
  approvedSellers: number;
  activeCustomers: number;
  approvedProducts: number;
}

function AdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      // Mock data for demonstration
      setStatistics({
        totalUsers: 1250,
        totalSellers: 45,
        totalCustomers: 1200,
        totalProducts: 3420,
        pendingSellers: 8,
        pendingProducts: 24,
        bannedCustomers: 5,
        approvedSellers: 37,
        activeCustomers: 1195,
        approvedProducts: 3350,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's your platform overview.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Users"
          value={statistics?.totalUsers || 0}
          icon={Users}
          trend={12}
          color="blue"
        />
        <DashboardCard
          title="Total Sellers"
          value={statistics?.totalSellers || 0}
          icon={UserCheck}
          trend={5}
          color="green"
          subtitle={`${statistics?.pendingSellers || 0} pending`}
        />
        <DashboardCard
          title="Total Customers"
          value={statistics?.totalCustomers || 0}
          icon={ShoppingCart}
          trend={8}
          color="purple"
          subtitle={`${statistics?.bannedCustomers || 0} banned`}
        />
        <DashboardCard
          title="Total Products"
          value={statistics?.totalProducts || 0}
          icon={Package}
          trend={15}
          color="orange"
          subtitle={`${statistics?.pendingProducts || 0} pending`}
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Sellers</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {statistics?.approvedSellers || 0}
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <UserCheck className="text-green-600" size={28} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-600" />
            <span className="text-xs text-green-600">+2 this week</span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Approved Products
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {statistics?.approvedProducts || 0}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <BarChart3 className="text-blue-600" size={28} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" />
            <span className="text-xs text-blue-600">+45 this week</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <StatisticsChart statistics={statistics} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Note: Using mock data. {error}
          </p>
        </div>
      )}
    </div>
  );
}
