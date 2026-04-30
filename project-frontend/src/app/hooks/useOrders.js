import { useCallback, useMemo, useState } from "react";
import {
  createOrder as createOrderRequest,
  createOrderFromCart as createOrderFromCartRequest,
  getAdminOrders,
  getMyOrders,
  normalizeApiError,
} from "../services";
import { useAsyncResource } from "./useAsyncResource";

function unwrapOrders(responseData) {
  return Array.isArray(responseData) ? responseData : [];
}

function getOrdersLoader(scope) {
  return scope === "admin" ? getAdminOrders : getMyOrders;
}

export function useOrders(options = {}) {
  const { scope = "mine", enabled = true, select = unwrapOrders } = options;
  const loader = useCallback(() => getOrdersLoader(scope)(), [scope]);
  const orders = useAsyncResource(loader, {
    enabled,
    initialData: [],
    select,
  });
  const [saving, setSaving] = useState(false);

  const createOrder = useCallback(
    async (payload) => {
      try {
        setSaving(true);
        orders.setError("");
        const response = await createOrderRequest(payload);
        await orders.refetch();
        return response.data;
      } catch (err) {
        orders.setError(normalizeApiError(err));
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [orders]
  );

  const createOrderFromCart = useCallback(async () => {
    try {
      setSaving(true);
      orders.setError("");
      const response = await createOrderFromCartRequest();
      await orders.refetch();
      return response.data;
    } catch (err) {
      orders.setError(normalizeApiError(err));
      throw err;
    } finally {
      setSaving(false);
    }
  }, [orders]);

  return {
    orders: orders.data,
    setOrders: orders.setData,
    loading: orders.loading,
    saving,
    error: orders.error,
    setError: orders.setError,
    refetch: orders.refetch,
    createOrder,
    createOrderFromCart,
  };
}

function formatAmount(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "BDT 0";

  return `BDT ${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(numeric)}`;
}

function mapStatus(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "paid") return "Delivered";
  if (normalized === "processing") return "Processing";
  if (normalized === "shipped") return "Shipped";
  return "Pending";
}

function toCsvValue(value) {
  const safe = String(value ?? "");
  return `"${safe.replace(/"/g, '""')}"`;
}

function mapAdminOrderRow(order) {
  return {
    id: order.id || order._id,
    orderId: `ORD-${order.id || order._id}`,
    user: order?.user?.fullName || order?.user?.name || "N/A",
    totalPrice: formatAmount(order.totalPrice),
    status: mapStatus(order.status),
    createdAt: order.createdAt || "",
  };
}

export function formatOrderDate(value) {
  if (!value) return "Just now";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function useAdminOrders() {
  const ordersState = useOrders({ scope: "admin" });
  const rows = useMemo(() => ordersState.orders.map(mapAdminOrderRow), [ordersState.orders]);

  const getCsv = useCallback(() => {
    if (rows.length === 0) return "";

    const headers = ["order_id", "user", "total_price", "status", "created_at"];
    return [
      headers.join(","),
      ...rows.map((row) =>
        [
          toCsvValue(row.orderId),
          toCsvValue(row.user),
          toCsvValue(row.totalPrice),
          toCsvValue(row.status),
          toCsvValue(row.createdAt),
        ].join(",")
      ),
    ].join("\n");
  }, [rows]);

  return {
    ...ordersState,
    rows,
    getCsv,
  };
}
