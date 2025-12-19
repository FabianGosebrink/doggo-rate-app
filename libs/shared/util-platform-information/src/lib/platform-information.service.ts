import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

export type Platform = 'Desktop' | 'Mobile' | 'Web';

@Injectable({
  providedIn: 'root',
})
export class PlatformInformationService {
  get isMobile(): boolean {
    return Capacitor.isNativePlatform();
  }

  get isElectron(): boolean {
    return window.navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
  }

  get isWeb(): boolean {
    return !this.isMobile && !this.isElectron;
  }

  get platform(): Platform {
    if (this.isElectron) {
      return 'Desktop';
    } else if (this.isMobile) {
      return 'Mobile';
    }

    return 'Web';
  }
}
