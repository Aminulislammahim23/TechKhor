import { useCallback, useMemo, useState } from "react";
import { approveProduct as approveProductRequest, getProductById, getProducts, normalizeApiError } from "../services";
import { useAsyncResource } from "./useAsyncResource";

export function unwrapProducts(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

export function useProducts(options = {}) {
  const { params, enabled = true, select = unwrapProducts } = options;
  const loader = useCallback(() => getProducts(params), [params]);
  const products = useAsyncResource(loader, {
    enabled,
    initialData: [],
    select,
  });
  const [approvingId, setApprovingId] = useState(null);

  const approveProduct = useCallback(
    async (productId) => {
      try {
        setApprovingId(productId);
        products.setError("");
        await approveProductRequest(productId);
        products.setData((current) =>
          current.map((product) =>
            product.id === productId || product._id === productId
              ? { ...product, isApproved: true, status: "Approved" }
              : product
          )
        );
      } catch (err) {
        products.setError(normalizeApiError(err));
      } finally {
        setApprovingId(null);
      }
    },
    [products]
  );

  return {
    products: products.data,
    setProducts: products.setData,
    loading: products.loading,
    error: products.error,
    setError: products.setError,
    refetch: products.refetch,
    approvingId,
    approveProduct,
  };
}

export function useProduct(id, options = {}) {
  const { enabled = Boolean(id) } = options;
  const loader = useCallback(() => getProductById(id), [id]);

  const product = useAsyncResource(loader, {
    enabled,
    initialData: null,
  });

  return {
    product: product.data,
    loading: product.loading,
    error: product.error,
    refetch: product.refetch,
  };
}

function formatPrice(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return "BDT 0";

  return `BDT ${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(number)}`;
}

function mapAdminProductRow(product) {
  return {
    id: product.id || product._id,
    name: product.name || "-",
    price: formatPrice(product.price),
    seller: product?.seller?.fullName || product?.seller?.name || "N/A",
    status: product?.isApproved || product?.status === "Approved" ? "Approved" : "Pending",
  };
}

export function useAdminProducts(options = {}) {
  const productsState = useProducts(options);
  const rows = useMemo(() => productsState.products.map(mapAdminProductRow), [productsState.products]);
  const pendingCount = useMemo(
    () => rows.filter((product) => product.status === "Pending").length,
    [rows]
  );

  return {
    ...productsState,
    rows,
    pendingCount,
  };
}

export function useSellerProducts(sellerId) {
  const params = useMemo(() => ({ limit: 200 }), []);
  const productsState = useProducts({ params, enabled: Boolean(sellerId) });

  const rows = useMemo(
    () =>
      productsState.products
        .filter((product) => Number(product?.seller?.id) === Number(sellerId))
        .map((product) => ({
          id: product.id || product._id,
          name: product.name || "-",
          price: formatPrice(product.price),
          status: product.isApproved ? "Approved" : "Pending",
        })),
    [productsState.products, sellerId]
  );

  return {
    rows,
    loading: productsState.loading,
    error: productsState.error,
    refetch: productsState.refetch,
  };
}
