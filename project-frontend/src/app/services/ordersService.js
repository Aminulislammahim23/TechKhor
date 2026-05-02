import apiClient from "./apiClient";

export const ordersService = {
  create(payload) {
    return apiClient.post("/orders", payload);
  },

  createFromCart() {
    return apiClient.post("/orders/from-cart");
  },

  getMine() {
    return apiClient.get("/orders/my");
  },

  getAdmin() {
    return apiClient.get("/orders/admin");
  },

  requestCancel(id) {
    return apiClient.post(`/orders/${id}/cancel-request`);
  },

  getSellerCancelRequests() {
    return apiClient.get("/orders/seller/cancel-requests");
  },

  acceptCancel(id) {
    return apiClient.post(`/orders/${id}/accept-cancel`);
  },
};

export const createOrder = ordersService.create;
export const createOrderFromCart = ordersService.createFromCart;
export const getMyOrders = ordersService.getMine;
export const getAdminOrders = ordersService.getAdmin;
export const requestOrderCancel = ordersService.requestCancel;
export const getSellerCancelRequests = ordersService.getSellerCancelRequests;
export const acceptOrderCancel = ordersService.acceptCancel;
