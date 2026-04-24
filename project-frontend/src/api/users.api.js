import api from "./api";

export function createSeller(payload) {
  return api.post("/users/create-seller", payload);
}

export function getSellers() {
  return api.get("/users/sellers");
}

export function deleteSeller(id) {
  return api.delete(`/users/sellers/${id}`);
}
