import httpClient from "./httpClient";

export const userService = {
  lookupCustomerByPhone(phone) {
    return httpClient.get("/users/customers/lookup", { params: { phone } });
  },

  getUsers() {
    return httpClient.get("/users");
  },

  getUserById(id) {
    return httpClient.get(`/users/${id}`);
  },

  updateUser(id, payload) {
    return httpClient.patch(`/users/${id}`, payload);
  },

  createSeller(payload) {
    return httpClient.post("/users/create-seller", payload);
  },

  getSellers() {
    return httpClient.get("/users/sellers");
  },

  deleteSeller(id) {
    return httpClient.delete(`/users/sellers/${id}`);
  },

  setSellerMaintenanceAccess(id, enabled) {
    return httpClient.patch(`/users/sellers/${id}/maintenance-access`, { enabled });
  },
};

export const lookupCustomerByPhone = userService.lookupCustomerByPhone;
export const getUsers = userService.getUsers;
export const getUserById = userService.getUserById;
export const updateUser = userService.updateUser;
export const updateUserById = userService.updateUser;
export const createSeller = userService.createSeller;
export const getSellers = userService.getSellers;
export const deleteSeller = userService.deleteSeller;
export const setSellerMaintenanceAccess = userService.setSellerMaintenanceAccess;
