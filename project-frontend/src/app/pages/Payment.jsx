import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { createPayment, getPayments, normalizeApiError } from "../api";

const initialForm = {
  orderId: "",
  amount: "",
  method: "cash",
};

function formatDate(value) {
  if (!value) return "Just now";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function Payment() {
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [purchaseNotification, setPurchaseNotification] = useState(null);
  const checkoutInfo = location.state || {};

  useEffect(() => {
    const state = location.state || {};
    setForm((current) => ({
      ...current,
      orderId: state.orderId ? String(state.orderId) : current.orderId,
      amount: state.amount ? String(state.amount) : current.amount,
    }));
  }, [location.state]);

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        setLoading(true);
        const response = await getPayments();
        if (active) {
          setPayments(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (active) {
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.orderId || !form.amount) {
      setError("Order ID and amount are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await createPayment({
        orderId: Number(form.orderId),
        amount: Number(form.amount),
        method: form.method,
      });

      const paymentStatus = response.data?.status || "completed";
      const notification = {
        orderId: form.orderId,
        amount: Number(form.amount),
        method: form.method,
        status: paymentStatus,
        deliveryType: checkoutInfo.deliveryType,
        deliveryAddress: checkoutInfo.deliveryAddress,
        customerName: checkoutInfo.customerName,
        customerPhone: checkoutInfo.customerPhone,
        items: Array.isArray(checkoutInfo.items) ? checkoutInfo.items : [],
      };
      setSuccess(
        paymentStatus === "pending"
          ? "Payment request submitted. Waiting for seller approval."
          : `Payment ${paymentStatus} successfully.`
      );
      setPurchaseNotification(notification);
      window.dispatchEvent(new Event("notificationschange"));
      const refreshed = await getPayments();
      setPayments(Array.isArray(refreshed.data) ? refreshed.data : []);
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Payments</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Complete payment</h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Select a payment method and complete your order.
          </p>
        </div>
        <Link to="/orders" className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5">
          View orders
        </Link>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      {purchaseNotification ? (
        <div className="mb-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-slate-200 shadow-xl shadow-slate-950/30">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {purchaseNotification.status === "pending" ? "Approval requested" : "Notification sent"}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {purchaseNotification.status === "pending"
              ? "Your payment is pending seller approval."
              : "Thank you for your purchase."}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {purchaseNotification.status === "pending"
              ? `The seller received an approval request for Order #${purchaseNotification.orderId}.`
              : `Your confirmation notification includes Order #${purchaseNotification.orderId}.`}{" "}
            Payment method {purchaseNotification.method}, total BDT{" "}
            {Number(purchaseNotification.amount).toLocaleString("en-BD")}.
          </p>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-slate-500">Order ID</p>
              <p className="mt-1 font-semibold text-white">#{purchaseNotification.orderId}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-slate-500">Amount</p>
              <p className="mt-1 font-semibold text-white">
                BDT {Number(purchaseNotification.amount).toLocaleString("en-BD")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-slate-500">Delivery</p>
              <p className="mt-1 font-semibold text-white">
                {purchaseNotification.deliveryType === "home_delivery" ? "Home Delivery" : "Collect from store"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
              <p className="text-slate-500">Customer</p>
              <p className="mt-1 font-semibold text-white">{purchaseNotification.customerName || "N/A"}</p>
            </div>
          </div>
          {purchaseNotification.deliveryAddress ? (
            <p className="mt-3 text-sm text-slate-300">Address: {purchaseNotification.deliveryAddress}</p>
          ) : null}
          {purchaseNotification.items.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {purchaseNotification.items.map((item) => (
                <div key={`${item.name}-${item.quantity}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm">
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="mt-1 text-slate-400">Quantity: {item.quantity}</p>
                  <p className="mt-1 text-slate-400">Price: BDT {Number(item.price).toLocaleString("en-BD")}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30">
          <h2 className="text-xl font-semibold text-white">Payment form</h2>

          {checkoutInfo.deliveryType ? (
            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-slate-300">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Order Type</p>
              <p className="mt-2 font-semibold text-white">
                {checkoutInfo.deliveryType === "home_delivery" ? "Home Delivery" : "Collect from store"}
              </p>
              {checkoutInfo.deliveryType === "home_delivery" ? (
                <div className="mt-3 space-y-1 text-slate-300">
                  <p>Customer ID: {checkoutInfo.customerId || "N/A"}</p>
                  <p>Name: {checkoutInfo.customerName || "N/A"}</p>
                  <p>Phone: {checkoutInfo.customerPhone || "N/A"}</p>
                  <p>Address: {checkoutInfo.deliveryAddress || "N/A"}</p>
                </div>
              ) : (
                <p className="mt-3 text-slate-300">Pay now to book this order for store pickup.</p>
              )}
            </div>
          ) : null}

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="orderId">
                Order ID
              </label>
              <input
                id="orderId"
                name="orderId"
                value={form.orderId}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Enter order ID"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="amount">
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="method">
                Method
              </label>
              <select
                id="method"
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-2xl bg-cyan-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          >
            {submitting ? "Processing..." : "Pay Now"}
          </button>
        </form>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Payment history</h2>
            <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">
              {payments.length} records
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-slate-300">Loading payments...</div>
          ) : null}

          {!loading && payments.length === 0 ? (
            <div className="py-8 text-slate-300">No payments found yet.</div>
          ) : null}

          <div className="mt-5 space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Payment #{payment.id}</p>
                    <p className="mt-1 text-sm text-slate-400">Order #{payment.order?.id}</p>
                    <p className="mt-1 text-sm text-slate-400">Created {formatDate(payment.createdAt)}</p>
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${payment.status === "success" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                    {payment.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div>
                    <p className="text-slate-500">Amount</p>
                    <p className="font-semibold text-white">BDT {Number(payment.amount).toLocaleString("en-BD")}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Method</p>
                    <p className="font-semibold text-white">{payment.method}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
