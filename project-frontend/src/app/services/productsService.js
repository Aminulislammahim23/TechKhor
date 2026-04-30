import apiClient from "./apiClient";

export function unwrapProducts(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

export const productsService = {
  getAll(params) {
    return apiClient.get("/products", { params });
  },

  getById(id) {
    return apiClient.get(`/products/${id}`);
  },

  getSellerPosProducts(params) {
    return apiClient.get("/products/seller/pos-search", { params });
  },

  create(payload) {
    return apiClient.post("/products", payload);
  },

  upload(file, onUploadProgress) {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post("/products/upload-products", formData, {
      onUploadProgress,
    });
  },

  approve(id) {
    return apiClient.patch(`/products/${id}/approve`);
  },
};

export const getProducts = productsService.getAll;
export const getProductById = productsService.getById;
export const getSellerPosProducts = productsService.getSellerPosProducts;
export const createProduct = productsService.create;
export const uploadProducts = productsService.upload;
export const approveProduct = productsService.approve;
