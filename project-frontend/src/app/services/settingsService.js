import httpClient from "./httpClient";

export const settingsService = {
  getMaintenanceStatus() {
    return httpClient.get("/admin/settings/maintenance");
  },

  updateMaintenanceStatus(maintenanceMode) {
    return httpClient.patch("/admin/settings/maintenance", { maintenanceMode });
  },

  getPublicMaintenanceStatus() {
    return httpClient.get("/maintenance/status");
  },

  getMaintenanceAccess() {
    return httpClient.get("/maintenance/access");
  },
};

export const getMaintenanceStatus = settingsService.getMaintenanceStatus;
export const updateMaintenanceStatus = settingsService.updateMaintenanceStatus;
export const getPublicMaintenanceStatus = settingsService.getPublicMaintenanceStatus;
export const getMaintenanceAccess = settingsService.getMaintenanceAccess;
