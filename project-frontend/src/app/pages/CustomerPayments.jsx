import { useEffect, useState } from "react";
import Table, { StatusPill } from "../components/Table";
import { getPayments } from "../api";

function formatCurrency(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "BDT 0";
  return `BDT ${numeric.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
}

function normalizeStatus(status) {
  const normalized = String(status || "").toLowerCase();
  if (["success", "paid", "completed"].includes(normalized)) return "Paid";
  if (normalized === "failed") return "Failed";
  return "Pending";
}

function normalizePayment(payment) {
  return {
    id: payment.id,
    paymentId: `PAY-${payment.id}`,
    orderId: payment?.order?.id ? `ORD-${payment.order.id}` : "N/A",
    amount: formatCurrency(payment.amount),
    method: payment.method || "N/A",
    status: normalizeStatus(payment.status),
  };
}

export default function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        setLoading(true);
        const response = await getPayments();
        const apiPayments = Array.isArray(response.data) ? response.data.map(normalizePayment) : [];
        if (active) {
          setPayments(apiPayments);
        }
      } catch {
        if (active) {
          setPayments([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    const timer = window.setTimeout(loadPayments, 500);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  const columns = [
    { key: "paymentId", label: "Payment ID" },
    { key: "orderId", label: "Order ID" },
    { key: "amount", label: "Amount" },
    { key: "method", label: "Method" },
    { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-slate-950">Payment History</h3>
          <p className="mt-1 text-sm text-slate-500">All successful, pending, and failed payments are listed here.</p>
        </div>
        <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          {payments.length} payments
        </span>
      </div>

      <Table
        columns={columns}
        data={payments}
        rowKey="id"
        loading={loading}
        variant="light"
        emptyTitle="No payments found"
        emptyDescription="Completed transactions will appear here after checkout."
      />
    </section>
  );
}
