import api from "./api";

export async function getDashboardAnalytics() {
  const response = await api.get("/admin/analytics");
  return response.data;
}

