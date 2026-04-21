interface StatisticsChartProps {
  statistics: {
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
  } | null;
}

export function StatisticsChart({ statistics }: StatisticsChartProps) {
  if (!statistics) return null;

  const data = [
    {
      label: "Users",
      value: statistics.totalUsers,
      percentage: 100,
    },
    {
      label: "Sellers",
      value: statistics.totalSellers,
      percentage: (statistics.totalSellers / statistics.totalUsers) * 100,
    },
    {
      label: "Customers",
      value: statistics.totalCustomers,
      percentage: (statistics.totalCustomers / statistics.totalUsers) * 100,
    },
    {
      label: "Products",
      value: statistics.totalProducts,
      percentage: 100,
    },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-6 text-lg font-bold text-gray-900">Platform Statistics</h3>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm font-bold text-gray-900">
                {item.value.toLocaleString()}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-yellow-50 p-4">
          <p className="text-xs font-medium text-yellow-800">Pending Approvals</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {(statistics.pendingSellers + statistics.pendingProducts).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-yellow-600">
            {statistics.pendingSellers} sellers · {statistics.pendingProducts} products
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-xs font-medium text-green-800">Approved Items</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {(statistics.approvedSellers + statistics.approvedProducts).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-green-600">
            {statistics.approvedSellers} sellers · {statistics.approvedProducts} products
          </p>
        </div>
      </div>
    </div>
  );
}
