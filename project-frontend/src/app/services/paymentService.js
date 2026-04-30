import httpClient from "./httpClient";

export const paymentService = {
  createPayment(payload) {
    return httpClient.post("/payments", payload);
  },

  getPayments() {
    return httpClient.get("/payments");
  },

  getAdminPayments() {
    return httpClient.get("/payments/admin");
  },
};

export const createPayment = paymentService.createPayment;
export const getPayments = paymentService.getPayments;
export const getAdminPayments = paymentService.getAdminPayments;
