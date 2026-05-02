import { useEffect, useMemo, useState } from "react";
import { getMyOrders, getProducts, normalizeApiError } from "../api";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUserIdFromToken } from "../utils/jwt";
import {
  acceptOrderCancel,
  approvePayment,
  getNotifications,
  getSellerCancelRequests,
  getSellerPendingApprovals,
  markNotificationRead,
} from "../services";

function unwrapProducts(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

export default function SellerDashboard() {
  const { token } = useAuth();
  const sellerId = getCurrentUserIdFromToken(token);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [cancelRequests, setCancelRequests] = useState([]);
  const [approvingId, setApprovingId] = useState("");
  const [acceptingCancelId, setAcceptingCancelId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [productsRes, ordersRes, notificationsRes, pendingApprovalsRes, cancelRequestsRes] = await Promise.all([
          getProducts({ limit: 200 }),
          getMyOrders(),
          getNotifications(),
          getSellerPendingApprovals(),
          getSellerCancelRequests(),
        ]);
        if (!active) return;

        const allProducts = unwrapProducts(productsRes.data);
        const mine = allProducts.filter((product) => Number(product?.seller?.id) === Number(sellerId));
        const notifications = Array.isArray(notificationsRes.data) ? notificationsRes.data : [];
        const pendingApprovals = Array.isArray(pendingApprovalsRes.data) ? pendingApprovalsRes.data : [];
        const sellerCancelRequests = Array.isArray(cancelRequestsRes.data) ? cancelRequestsRes.data : [];
        const notificationRequests = notifications.filter((item) => item.type === "payment_approval" && !item.readAt);
        const notificationPaymentIds = new Set(
          notificationRequests.map((item) => Number(item?.metadata?.paymentId || 0)).filter(Boolean)
        );

        setProducts(mine);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setPaymentRequests(
          [
            ...notificationRequests,
            ...pendingApprovals
              .filter((item) => !notificationPaymentIds.has(Number(item.paymentId)))
              .map((item) => ({
                id: `payment-${item.paymentId}`,
                type: "payment_approval",
                message: `Payment request for order #${item.orderId} is pending seller approval.`,
                createdAt: item.createdAt,
                metadata: {
                  paymentId: item.paymentId,
                  orderId: item.orderId,
                  totalPrice: item.amount,
                  customerName: item.customerName,
                  customerPhone: item.customerPhone,
                  deliveryType: item.deliveryType,
                  deliveryAddress: item.deliveryAddress,
                  items: item.items || [],
                },
              })),
          ]
        );
        setCancelRequests(sellerCancelRequests);
      } catch (err) {
        if (active) {
          setError(normalizeApiError(err));
          setProducts([]);
          setOrders([]);
          setPaymentRequests([]);
          setCancelRequests([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [sellerId]);

  const handleApprovePayment = async (request) => {
    const paymentId = request?.metadata?.paymentId;
    if (!paymentId) {
      setError("Payment ID missing from this approval request.");
      return;
    }

    try {
      setApprovingId(request.id);
      setError("");
      await approvePayment(paymentId);
      if (!String(request.id).startsWith("payment-")) {
        await markNotificationRead(request.id);
      }
      setPaymentRequests((current) => current.filter((item) => item.id !== request.id));
      window.dispatchEvent(new Event("notificationschange"));
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setApprovingId("");
    }
  };

  const handleAcceptCancel = async (request) => {
    try {
      setAcceptingCancelId(request.id);
      setError("");
      await acceptOrderCancel(request.orderId || request.id);
      setCancelRequests((current) => current.filter((item) => item.id !== request.id));
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setAcceptingCancelId("");
    }
  };

  const stats = useMemo(
    () => [
      {
        title: "My Products",
        value: products.length,
        hint: `${products.filter((item) => item.isApproved).length} approved`,
      },
      {
        title: "My Orders",
        value: orders.length,
        hint: "Filtering-ready for seller mapping",
      },
    ],
    [products, orders]
  );

  return (
    <section className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          Loading dashboard...
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {stats.map((card) => (
          <article key={card.title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">{card.title}</p>
            <p className="mt-3 text-4xl font-bold text-white">{card.value}</p>
            <p className="mt-2 text-sm text-slate-400">{card.hint}</p>
          </article>
        ))}
      </div>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Payment Requests</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Pending seller approval</h3>
          </div>
          <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
            {paymentRequests.length} pending
          </span>
        </div>

        {!loading && paymentRequests.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
            No payment request available right now.
          </div>
        ) : null}

        <div className="mt-5 grid gap-4">
          {paymentRequests.map((request) => {
            const metadata = request.metadata || {};
            const items = Array.isArray(metadata.items) ? metadata.items : [];

            return (
              <article key={request.id} className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Order #{metadata.orderId || request.order?.id || "N/A"}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{request.message}</p>
                    <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                      <span>Total: BDT {Number(metadata.totalPrice || 0).toLocaleString("en-BD")}</span>
                      <span>Customer: {metadata.customerName || "N/A"}</span>
                      <span>Phone: {metadata.customerPhone || "N/A"}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApprovePayment(request)}
                    disabled={approvingId === request.id}
                    className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
                  >
                    {approvingId === request.id ? "Approving..." : "Approve payment"}
                  </button>
                </div>

                {items.length > 0 ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                      <div key={`${request.id}-${item.name}`} className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="mt-1">Quantity: {item.quantity}</p>
                        <p className="mt-1">Price: BDT {Number(item.price || 0).toLocaleString("en-BD")}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Cancel Requests</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Customer cancellation requests</h3>
          </div>
          <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
            {cancelRequests.length} pending
          </span>
        </div>

        {!loading && cancelRequests.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
            No cancellation request available right now.
          </div>
        ) : null}

        <div className="mt-5 grid gap-4">
          {cancelRequests.map((request) => {
            const items = Array.isArray(request.items) ? request.items : [];

            return (
              <article key={request.id} className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Order #{request.orderId || request.id}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Customer requested cancellation. If you accept, this order will show as canceled.
                    </p>
                    <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                      <span>Total: BDT {Number(request.totalPrice || 0).toLocaleString("en-BD")}</span>
                      <span>Customer: {request.customerName || "N/A"}</span>
                      <span>Phone: {request.customerPhone || "N/A"}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAcceptCancel(request)}
                    disabled={acceptingCancelId === request.id}
                    className="rounded-2xl bg-rose-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
                  >
                    {acceptingCancelId === request.id ? "Accepting..." : "Accept cancel"}
                  </button>
                </div>

                {items.length > 0 ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                      <div key={`${request.id}-${item.name}`} className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="mt-1">Quantity: {item.quantity}</p>
                        <p className="mt-1">Price: BDT {Number(item.price || 0).toLocaleString("en-BD")}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
