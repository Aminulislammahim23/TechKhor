const CART_KEY = "techkhor_cart";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readCart() {
  if (!canUseStorage()) return [];

  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(cart) {
  if (!canUseStorage()) return;

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartchange"));
}

export function getCartItems() {
  return readCart();
}

export function addToCart(product, quantity = 1) {
  const cart = readCart();
  const existingIndex = cart.findIndex((item) => item.product.id === product.id);

  if (existingIndex >= 0) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity: cart[existingIndex].quantity + quantity,
    };
  } else {
    cart.push({
      product,
      quantity,
    });
  }

  writeCart(cart);
  return cart;
}

export function updateCartQuantity(productId, quantity) {
  const nextQuantity = Number(quantity);
  if (nextQuantity < 1) {
    return removeFromCart(productId);
  }

  const cart = readCart()
    .map((item) =>
      item.product.id === productId
        ? { ...item, quantity: nextQuantity }
        : item
    )
    .filter(Boolean);

  writeCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  const cart = readCart().filter((item) => item.product.id !== productId);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart([]);
}

export function getCartTotals(items = readCart()) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  return {
    itemCount,
    totalAmount,
  };
}
