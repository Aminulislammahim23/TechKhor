function StatusPill({ status }) {
  const styles = {
    Approved: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
    Delivered: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
    Completed: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
    Paid: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
    Success: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
    Processing: "bg-blue-500/15 text-blue-300 ring-blue-400/20",
    Shipped: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/20",
    Pending: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
    Failed: "bg-rose-500/15 text-rose-300 ring-rose-400/20",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles[status] || "bg-white/10 text-slate-200 ring-white/10"}`}>
      {status}
    </span>
  );
}

export default function Table({
  columns,
  data,
  rowKey,
  renderRowActions,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There is no data to show yet.",
  variant = "dark",
}) {
  const rows = Array.isArray(data) ? data : [];
  const isLight = variant === "light";

  return (
    <div
      className={`overflow-hidden rounded-2xl shadow-xl ${
        isLight
          ? "border border-slate-200 bg-white shadow-slate-200/70"
          : "border border-white/10 bg-slate-900/70 shadow-slate-950/30 backdrop-blur"
      }`}
    >
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${isLight ? "divide-slate-200" : "divide-white/10"}`}>
          <thead className={isLight ? "bg-slate-50" : "bg-white/5"}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {column.label}
                </th>
              ))}
              {renderRowActions ? (
                <th
                  scope="col"
                  className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Action
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className={`divide-y ${isLight ? "divide-slate-100" : "divide-white/5"}`}>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`loading-${index}`}>
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-5">
                        <div className={`h-4 w-28 animate-pulse rounded-full ${isLight ? "bg-slate-100" : "bg-white/10"}`} />
                      </td>
                    ))}
                    {renderRowActions ? (
                      <td className="px-6 py-5">
                        <div className={`ml-auto h-9 w-24 animate-pulse rounded-full ${isLight ? "bg-slate-100" : "bg-white/10"}`} />
                      </td>
                    ) : null}
                  </tr>
                ))
              : null}

            {!loading && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderRowActions ? 1 : 0)}
                  className={`px-6 py-12 text-center ${isLight ? "text-slate-500" : "text-slate-400"}`}
                >
                  <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${isLight ? "bg-slate-100" : "bg-white/5"}`}>
                    <span className={isLight ? "text-slate-400" : "text-slate-500"}>--</span>
                  </div>
                  <p className={`text-base font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>{emptyTitle}</p>
                  <p className="mt-1 text-sm">{emptyDescription}</p>
                </td>
              </tr>
            ) : null}

            {!loading && rows.map((row, index) => (
              <tr key={row[rowKey] ?? index} className={`transition ${isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.03]"}`}>
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-5 text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {renderRowActions ? (
                  <td className="px-6 py-5 text-right text-sm">
                    {renderRowActions(row)}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { StatusPill };
