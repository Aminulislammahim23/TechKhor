import api from "./api";
import {
  analyticsSummary,
  ordersData,
  productStatusData,
  revenueData,
  usersData,
} from "../data/analyticsData";

const fallbackAnalytics = {
  revenueData,
  ordersData,
  productStatusData,
  usersData,
  analyticsSummary,
};

export async function getDashboardAnalytics() {
  try {
    const response = await api.get("/admin/analytics");
    return response.data;
  } catch {
    return fallbackAnalytics;
  }
}

