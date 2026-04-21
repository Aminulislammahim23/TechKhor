import { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  color?: "blue" | "green" | "purple" | "orange";
  subtitle?: string;
}

const colorClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
};

export function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
  subtitle,
}: DashboardCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon size={28} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-green-600" />
          <span className="text-xs text-green-600">+{trend}% this month</span>
        </div>
      )}
    </div>
  );
}
