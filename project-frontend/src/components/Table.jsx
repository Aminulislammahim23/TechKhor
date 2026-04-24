function StatusPill({ status }) {
  const styles = {
    Approved: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
    Delivered: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
    Paid: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
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

export default function Table({ columns, data, rowKey, renderRowActions }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-slate-950/30 backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                >
                  {column.label}
                </th>
              ))}
              {renderRowActions ? (
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Action
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, index) => (
              <tr key={row[rowKey] ?? index} className="transition hover:bg-white/[0.03]">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-5 text-sm text-slate-200">
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
