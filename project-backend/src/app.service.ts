import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private maintenanceMode = false;

  getHello(): string {
    return 'Hello World!';
  }

  getMaintenanceStatus() {
    return { maintenanceMode: this.maintenanceMode };
  }

  setMaintenanceMode(enabled: boolean) {
    this.maintenanceMode = enabled;
    return this.getMaintenanceStatus();
  }
}
