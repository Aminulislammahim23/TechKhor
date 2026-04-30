import httpClient from "./httpClient";

export const earningsService = {
  getSellerEarnings() {
    return httpClient.get("/seller/earnings");
  },

  getAdminSellerEarnings() {
    return httpClient.get("/admin/seller-earnings");
  },
};

export const getSellerEarnings = earningsService.getSellerEarnings;
export const getAdminSellerEarnings = earningsService.getAdminSellerEarnings;
