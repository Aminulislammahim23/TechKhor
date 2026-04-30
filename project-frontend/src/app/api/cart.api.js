import api from "./axios";

export const addToCart = (data) => api.post("/cart", data);
export const getCart = () => api.get("/cart");