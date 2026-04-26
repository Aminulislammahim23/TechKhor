import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, getUserById, normalizeApiError } from "../api";
import { clearCart, getCartItems, getCartTotals, removeFromCart, updateCartQuantity } from "../utils/cart";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUserIdFromToken } from "../utils/jwt";

export default function Cart() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const sync = () => setItems(getCartItems());
    sync();

    window.addEventListener("cartchange", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("cartchange", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const { itemCount, totalAmount } = getCartTotals(items);
  const currentUserId = getCurrentUserIdFromToken(token);

  useEffect(() => {
    if (!checkoutOpen || deliveryType !== "home_delivery" || !currentUserId || currentUser) return;

    let active = true;

    async function loadUser() {
      try {
        const response = await getUserById(currentUserId);
        if (active) {
          setCurrentUser(response.data || null);
        }
      } catch {
        if (active) {
          setCurrentUser(null);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [checkoutOpen, deliveryType, currentUserId, currentUser]);

  const handleQuantityChange = (productId, nextQuantity) => {
    if (nextQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, nextQuantity);
    }

    setItems(getCartItems());
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    setItems(getCartItems());
  };

  const handlePlaceOrder = () => {
    setError("");

    if (items.length === 0) {
      setError("Cart is empty");
      return;
    }

    setCheckoutOpen(true);
  };

  const handleConfirmCheckout = async () => {
    if (!deliveryType) {
      setError("Select collect from store or home delivery.");
      return;
    }

    if (deliveryType === "home_delivery" && !deliveryAddress.trim()) {
      setError("Location address is required for home delivery.");
      return;
    }

    if (deliveryType === "home_delivery" && !currentUser) {
      setError("Customer information is still loading. Please try again in a moment.");
      return;
    }

    const orderItems = items.map((item) => ({
      productId: Number(item.product.id),
      quantity: Number(item.quantity),
    }));

    if (orderItems.some((item) => !item.productId || item.quantity <= 0)) {
      setError("Some cart products are invalid. Please remove and add them again.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");
      setSuccess("");

      const response = await createOrder({
        items: orderItems,
        deliveryType,
        deliveryAddress: deliveryType === "home_delivery" ? deliveryAddress.trim() : "",
        customerName: deliveryType === "home_delivery" ? currentUser?.fullName || "" : "",
        customerPhone: deliveryType === "home_delivery" ? currentUser?.phone || "" : "",
      });
      const order = response.data;
      clearCart();
      setItems([]);
      setCheckoutOpen(false);
      setSuccess("Order created successfully.");
      navigate("/payment", {
        state: {
          orderId: order?.id,
          amount: Number(order?.totalPrice ?? totalAmount),
          deliveryType,
          deliveryAddress: order?.deliveryAddress || deliveryAddress,
          customerName: order?.customerName || currentUser?.fullName || "",
          customerPhone: order?.customerPhone || currentUser?.phone || "",
          customerId: order?.customer?.id || currentUser?.id || currentUserId || "",
        },
      });
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Your cart</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Shopping cart</h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Review the items you want to purchase, then place the order and continue to payment.
          </p>
        </div>
        <Link to="/products" className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5">
          Continue Shopping
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

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-semibold text-white">Cart items</h2>
            <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">{itemCount} items</span>
          </div>

          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              Your cart is empty. Add products from the catalog to continue.
            </div>
          ) : (
            <div className="space-y-4 pt-5">
              {items.map((item) => (
                <div key={item.product.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.product.name}</h3>
                    <p className="text-sm text-slate-400">BDT {Number(item.product.price).toLocaleString("en-BD")}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      className="rounded-full border border-white/10 px-3 py-2 text-white transition hover:bg-white/5"
                    >
                      -
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold text-white">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      className="rounded-full border border-white/10 px-3 py-2 text-white transition hover:bg-white/5"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.product.id)}
                      className="rounded-full border border-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/30">
          <h2 className="text-xl font-semibold text-white">Order summary</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="text-lg font-semibold text-white">BDT {totalAmount.toLocaleString("en-BD")}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placingOrder || items.length === 0}
            className="mt-6 w-full rounded-2xl bg-cyan-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </div>

      {checkoutOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-cyan-950/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Checkout</p>
                <h2 className="mt-2 text-2xl font-black text-white">Choose delivery option</h2>
                <p className="mt-2 text-sm text-slate-400">Select how you want to receive this order.</p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setDeliveryType("collect_store")}
                className={`rounded-3xl border p-5 text-left transition ${
                  deliveryType === "collect_store"
                    ? "border-cyan-300 bg-cyan-400/15"
                    : "border-white/10 bg-white/5 hover:border-cyan-400/40"
                }`}
              >
                <h3 className="text-lg font-bold text-white">Collect from store</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Pay now and keep the order booked for store pickup.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType("home_delivery")}
                className={`rounded-3xl border p-5 text-left transition ${
                  deliveryType === "home_delivery"
                    ? "border-cyan-300 bg-cyan-400/15"
                    : "border-white/10 bg-white/5 hover:border-cyan-400/40"
                }`}
              >
                <h3 className="text-lg font-bold text-white">Home Delivery</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Use your account name, phone, and add delivery location.
                </p>
              </button>
            </div>

            {deliveryType === "home_delivery" ? (
              <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                  <div>
                    <p className="text-slate-500">Customer ID</p>
                    <p className="mt-1 font-semibold text-white">{currentUser?.id || currentUserId || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Name</p>
                    <p className="mt-1 font-semibold text-white">{currentUser?.fullName || "Loading..."}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Phone</p>
                    <p className="mt-1 font-semibold text-white">{currentUser?.phone || "N/A"}</p>
                  </div>
                </div>

                <label className="mt-4 block text-sm font-medium text-slate-300">
                  Location Address
                  <textarea
                    value={deliveryAddress}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    rows={3}
                    placeholder="House, road, area, city"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </label>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleConfirmCheckout}
              disabled={placingOrder}
              className="mt-6 w-full rounded-2xl bg-cyan-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
            >
              {placingOrder ? "Creating Order..." : "Continue to Payment"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
