import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartCard from "./ChartCard";

const COLORS = ["#22c55e", "#f59e0b"];

const tooltipStyle = {
  background: "rgba(2, 6, 23, 0.96)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: 16,
  color: "#e2e8f0",
};

export default function ProductChart({ data = [], loading = false }) {
  return (
    <ChartCard title="Product Status Chart" subtitle="Approved vs pending products">
      <div className="h-80">
        {loading ? (
          <div className="flex h-full animate-pulse items-center justify-center rounded-2xl bg-white/5">
            <div className="h-44 w-44 rounded-full bg-white/5" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={tooltipStyle} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                animationDuration={1200}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-300">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
