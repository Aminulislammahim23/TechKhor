import api from "./api";

export function getUsers() {
  return api.get("/users");
}

export function getUserById(id) {
  return api.get(`/users/${id}`);
}

export function updateUser(id, payload) {
  return api.patch(`/users/${id}`, payload);
}

export function createSeller(payload) {
  return api.post("/users/create-seller", payload);
}

export function getSellers() {
  return api.get("/users/sellers");
}

export function deleteSeller(id) {
  return api.delete(`/users/sellers/${id}`);
}

export function setSellerMaintenanceAccess(id, enabled) {
  return api.patch(`/users/sellers/${id}/maintenance-access`, { enabled });
}
