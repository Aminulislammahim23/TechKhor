import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  approvePayment,
  getNotifications,
  getSellerPendingApprovals,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services";

function formatTime(value) {
  if (!value) return "Just now";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatAmount(value) {
  const numeric = Number(value || 0);
  return `BDT ${numeric.toLocaleString("en-BD")}`;
}

function mapPendingApprovalToNotification(item) {
  return {
    id: `payment-${item.paymentId}`,
    type: "payment_approval",
    title: "Payment approval request",
    message: `Payment request for order #${item.orderId} is pending seller approval.`,
    createdAt: item.createdAt,
    readAt: null,
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
  };
}

export default function NotificationBell({
  orderLink = "/orders",
  actionLabel = "View order",
  includePaymentApprovals = false,
  variant = "dark",
  label = "",
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.readAt).length,
    [notifications]
  );

  const loadNotifications = useCallback(async (active = true) => {
    try {
      setLoading(true);
      setError("");
      const [notificationsResponse, pendingApprovalsResponse] = await Promise.all([
        getNotifications(),
        includePaymentApprovals ? getSellerPendingApprovals() : Promise.resolve({ data: [] }),
      ]);
      if (active) {
        const notificationRows = Array.isArray(notificationsResponse.data) ? notificationsResponse.data : [];
        const pendingApprovals = Array.isArray(pendingApprovalsResponse.data) ? pendingApprovalsResponse.data : [];
        const notificationPaymentIds = new Set(
          notificationRows
            .map((item) => Number(item?.metadata?.paymentId || 0))
            .filter(Boolean)
        );
        const fallbackRows = pendingApprovals
          .filter((item) => !notificationPaymentIds.has(Number(item.paymentId)))
          .map(mapPendingApprovalToNotification);

        setNotifications([...notificationRows, ...fallbackRows]);
      }
    } catch (err) {
      if (active) {
        setNotifications([]);
        setError(err?.message || "Could not load notifications.");
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }, [includePaymentApprovals]);

  useEffect(() => {
    let active = true;

    loadNotifications(active);
    const refresh = () => loadNotifications(active);
    const timer = window.setInterval(refresh, 10000);
    window.addEventListener("notificationschange", refresh);

    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("notificationschange", refresh);
    };
  }, [loadNotifications]);

  useEffect(() => {
    if (open) {
      loadNotifications(true);
    }
  }, [loadNotifications, open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((current) =>
      current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() }))
    );
  };

  const handleApproveNotification = async (notification) => {
    const metadata = notification.metadata || {};

    if (notification.type === "payment_approval" && metadata.paymentId) {
      await approvePayment(metadata.paymentId);
    }

    const id = notification.id;
    if (!String(id).startsWith("payment-")) {
      await markNotificationRead(id);
    }
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, readAt: item.readAt || new Date().toISOString() } : item
      )
    );
    window.dispatchEvent(new Event("notificationschange"));
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`relative inline-flex items-center justify-center border text-sm transition ${
          label ? "h-12 rounded-2xl px-4" : "h-10 w-10 rounded-full"
        } ${
          variant === "light"
            ? "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-slate-950"
            : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/30 hover:bg-white/10 hover:text-white"
        }`}
        aria-label="Notifications"
      >
        {label ? <span className="font-medium">{label}</span> : null}
        <svg viewBox="0 0 24 24" className={label ? "ml-2 h-5 w-5" : "h-5 w-5"} fill="none" aria-hidden="true">
          <path
            d="M18 9.5a6 6 0 1 0-12 0c0 7-3 7-3 8.5h18c0-1.5-3-1.5-3-8.5ZM10 21h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-cyan-300 px-1.5 py-0.5 text-center text-[10px] font-bold text-slate-950">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-[22rem] max-w-[calc(100vw-2rem)] rounded-3xl border border-white/10 bg-slate-950 p-4 shadow-2xl shadow-slate-950/60">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <p className="text-sm font-semibold text-white">Notifications</p>
              <p className="text-xs text-slate-400">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="rounded-full border border-cyan-400/30 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/10"
              >
                Mark read
              </button>
            ) : null}
          </div>

          {loading ? <div className="py-6 text-sm text-slate-300">Loading notifications...</div> : null}

          {error && !loading ? (
            <div className="py-6 text-sm text-rose-300">{error}</div>
          ) : null}

          {!loading && !error && notifications.length === 0 ? (
            <div className="py-6 text-sm text-slate-300">No notifications yet.</div>
          ) : null}

          <div className="max-h-96 space-y-3 overflow-y-auto pt-3">
            {notifications.map((notification) => {
              const metadata = notification.metadata || {};
              return (
                <article
                  key={notification.id}
                  className={`rounded-2xl border p-4 ${
                    notification.readAt
                      ? "border-white/10 bg-white/5"
                      : "border-cyan-400/20 bg-cyan-400/10"
                  }`}
                >
                  <p className="text-sm font-semibold text-white">{notification.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{notification.message}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <span>Order #{metadata.orderId || notification.order?.id || "N/A"}</span>
                    <span>{formatAmount(metadata.totalPrice)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">{formatTime(notification.createdAt)}</span>
                    <div className="flex items-center gap-3">
                      {["home_delivery_approval", "payment_approval"].includes(notification.type) && !notification.readAt ? (
                        <button
                          type="button"
                          onClick={() => handleApproveNotification(notification)}
                          className="text-xs font-semibold text-emerald-300 transition hover:text-emerald-200"
                        >
                          {notification.type === "payment_approval" ? "Approve payment" : "Approve delivery"}
                        </button>
                      ) : null}
                      <Link
                        to={orderLink}
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
                      >
                        {actionLabel}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
