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

  getSellerPendingApprovals() {
    return httpClient.get("/payments/seller/pending-approvals");
  },

  approvePayment(id) {
    return httpClient.post(`/payments/${id}/approve`);
  },
};

export const createPayment = paymentService.createPayment;
export const getPayments = paymentService.getPayments;
export const getAdminPayments = paymentService.getAdminPayments;
export const getSellerPendingApprovals = paymentService.getSellerPendingApprovals;
export const approvePayment = paymentService.approvePayment;
