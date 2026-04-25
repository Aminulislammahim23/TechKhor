import { useEffect, useMemo, useRef, useState } from "react";
import ProductSearch from "../components/ProductSearch";
import Cart from "../components/Cart";
import BillingSummary from "../components/BillingSummary";
import Receipt from "../components/Receipt";
import { createOrder, createPayment, getProducts, normalizeApiError } from "../api";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUserIdFromToken } from "../utils/jwt";

function unwrapProducts(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

export default function SellerPOS() {
  const { token } = useAuth();
  const sellerId = getCurrentUserIdFromToken(token);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState("0");
  const [taxRate, setTaxRate] = useState("5");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(async () => {
      try {
        setSearchLoading(true);
        const response = await getProducts({
          search: query.trim(),
          limit: 20,
        });
        const list = unwrapProducts(response.data);
        const filtered = list.filter(
          (item) =>
            Number(item?.seller?.id) === Number(sellerId) &&
            Boolean(item?.isApproved) &&
            Number(item?.stock) > 0
        );
        setSearchResults(filtered);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [query, sellerId]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [cartItems]
  );
  const discountAmount = Math.max(0, Number(discount) || 0);
  const taxable = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxable * (Number(taxRate) || 0)) / 100;
  const total = Math.max(0, taxable + taxAmount);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addToCart = (product) => {
    setError("");
    setCreatedOrder(null);
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= Number(product.stock)) return current;
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
          stock: Number(product.stock),
        },
      ];
    });
  };

  const incrementQty = (id) => {
    setCreatedOrder(null);
    setCartItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) } : item
      )
    );
  };

  const decrementQty = (id) => {
    setCreatedOrder(null);
    setCartItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCreatedOrder(null);
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const generateBill = async () => {
    if (cartItems.length === 0) {
      setError("Add products before generating bill.");
      return;
    }

    try {
      setCreatingOrder(true);
      setError("");
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };
      const response = await createOrder(payload);
      setCreatedOrder(response.data);
      setToast("Bill generated successfully.");
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setCreatingOrder(false);
    }
  };

  const completePayment = async () => {
    if (!createdOrder?.id) {
      setError("Generate bill first.");
      return;
    }

    try {
      setProcessingPayment(true);
      setError("");
      const response = await createPayment({
        orderId: Number(createdOrder.id),
        amount: Number(total.toFixed(2)),
        method: paymentMethod,
      });

      const payment = response.data;
      setReceipt({
        orderId: createdOrder.id,
        transactionId: payment?.transactionId || null,
        paymentMethod: paymentMethod,
        subtotal,
        discount: discountAmount,
        taxAmount,
        total,
        createdAt: new Date().toISOString(),
        items: cartItems,
      });
      setToast("Sale completed successfully.");
      setCartItems([]);
      setCreatedOrder(null);
      setDiscount("0");
      setTaxRate("5");
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <section className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {toast ? (
        <div className="fixed right-5 top-5 z-50 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {toast}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ProductSearch
          query={query}
          onQueryChange={setQuery}
          products={searchResults}
          loading={searchLoading}
          onAddProduct={addToCart}
        />

        <div className="space-y-6">
          <Cart
            items={cartItems}
            onIncrement={incrementQty}
            onDecrement={decrementQty}
            onRemove={removeItem}
          />
          <BillingSummary
            subtotal={subtotal}
            discount={discount}
            onDiscountChange={setDiscount}
            taxRate={taxRate}
            onTaxRateChange={setTaxRate}
            taxAmount={taxAmount}
            total={total}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onGenerateBill={generateBill}
            onCompletePayment={completePayment}
            generatingBill={creatingOrder}
            processingPayment={processingPayment}
            orderId={createdOrder?.id}
            canGenerate={cartItems.length > 0}
            canPay={Boolean(createdOrder?.id)}
          />
        </div>
      </div>

      <Receipt receipt={receipt} onClose={() => setReceipt(null)} />
    </section>
  );
}
