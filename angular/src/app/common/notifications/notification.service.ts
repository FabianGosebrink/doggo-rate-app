import { Injectable } from '@angular/core';
import { PlatformInformationService } from '../platform-information/platform-information.service';
import { DesktopNotificationService } from './desktop-notification.service';
import { MobileNotificationService } from './mobile-notification.service';
import { WebNotificationService } from './web-notification.service';

export function notificationFactory(
  platformInformationService: PlatformInformationService,
  webNotificationService: WebNotificationService,
  desktopNotificationService: DesktopNotificationService,
  mobileNotificationService: MobileNotificationService
): NotificationService {
  const { isElectron, isMobile } = platformInformationService;
  if (isElectron) {
    return desktopNotificationService;
  } else if (isMobile) {
    return mobileNotificationService;
  }
  return webNotificationService;
}

@Injectable({
  providedIn: 'root',
  useFactory: notificationFactory,
  deps: [
    PlatformInformationService,
    WebNotificationService,
    DesktopNotificationService,
    MobileNotificationService,
  ],
})
export abstract class NotificationService {
  abstract showSuccess(message?: string, title?: string): void;
  abstract showError(message?: string, title?: string): void;
}
