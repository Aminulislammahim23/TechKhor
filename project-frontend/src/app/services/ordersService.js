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
};

export const createOrder = ordersService.create;
export const createOrderFromCart = ordersService.createFromCart;
export const getMyOrders = ordersService.getMine;
export const getAdminOrders = ordersService.getAdmin;
