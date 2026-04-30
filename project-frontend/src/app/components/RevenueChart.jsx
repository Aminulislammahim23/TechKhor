import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "./ChartCard";

const tooltipStyle = {
  background: "rgba(2, 6, 23, 0.96)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: 16,
  color: "#e2e8f0",
};

export default function RevenueChart({ data = [], loading = false }) {
  return (
    <ChartCard
      title="Revenue Chart"
      subtitle="Monthly revenue performance across TechKhor"
    >
      <div className="h-80">
        {loading ? (
          <div className="flex h-full animate-pulse items-center justify-center rounded-2xl bg-white/5">
            <div className="space-y-3 text-center">
              <div className="mx-auto h-3 w-24 rounded-full bg-white/10" />
              <div className="mx-auto h-40 w-full rounded-2xl bg-white/5 sm:w-96" />
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(34,211,238,0.08)" }} />
              <Bar dataKey="revenue" fill="#22d3ee" radius={[12, 12, 0, 0]} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
