import api from "./axios";

export const getProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);