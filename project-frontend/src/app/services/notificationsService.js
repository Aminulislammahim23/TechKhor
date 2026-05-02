import httpClient from "./httpClient";

export const notificationsService = {
  getMine() {
    return httpClient.get("/notifications/my");
  },

  markRead(id) {
    return httpClient.patch(`/notifications/${id}/read`);
  },

  markAllRead() {
    return httpClient.patch("/notifications/read-all");
  },
};

export const getNotifications = notificationsService.getMine;
export const markNotificationRead = notificationsService.markRead;
export const markAllNotificationsRead = notificationsService.markAllRead;
