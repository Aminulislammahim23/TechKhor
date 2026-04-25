import { useEffect, useMemo, useState } from "react";
import Table, { StatusPill } from "../components/Table";
import { getAdminPayments, normalizeApiError } from "../api";

function formatAmount(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "$0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numeric);
}

function mapStatus(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "success") return "Paid";
  if (normalized === "failed") return "Failed";
  return "Pending";
}

function toCsvValue(value) {
  const safe = String(value ?? "");
  return `"${safe.replace(/"/g, '""')}"`;
}

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        setLoading(true);
        setError("");
        const response = await getAdminPayments();

        if (active) {
          setPayments(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (active) {
          setPayments([]);
          setError(normalizeApiError(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPayments();

    return () => {
      active = false;
    };
  }, []);

  const rows = useMemo(
    () =>
      payments.map((payment) => ({
        id: payment.id,
        paymentId: `PAY-${payment.id}`,
        orderId: payment?.order?.id ? `ORD-${payment.order.id}` : "N/A",
        amount: formatAmount(payment.amount),
        status: mapStatus(payment.status),
        method: payment.method || "N/A",
        createdAt: payment.createdAt || "",
      })),
    [payments]
  );

  const downloadCsv = () => {
    if (rows.length === 0) return;

    const headers = ["payment_id", "order_id", "amount", "status", "method", "created_at"];
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        [
          toCsvValue(row.paymentId),
          toCsvValue(row.orderId),
          toCsvValue(row.amount),
          toCsvValue(row.status),
          toCsvValue(row.method),
          toCsvValue(row.createdAt),
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `payments-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns = [
    { key: "paymentId", label: "Payment ID" },
    { key: "orderId", label: "Order ID" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
    { key: "method", label: "Method" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-300 ring-1 ring-white/10">
          {rows.length} records
        </span>
        <button
          type="button"
          onClick={downloadCsv}
          disabled={rows.length === 0}
          className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
        >
          Download CSV
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          Loading payments...
        </div>
      ) : null}

      <Table columns={columns} data={rows} rowKey="id" />
    </section>
  );
}
