import { TestBed } from '@angular/core/testing';
import { PlatformInformationService } from '@dog-rating/shared/util-platform-information';
import { ToastrService } from 'ngx-toastr';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DesktopNotificationService } from './desktop-notification.service';
import { MobileNotificationService } from './mobile-notification.service';
import {
  NotificationService,
  notificationFactory,
} from './notification.service';
import { WebNotificationService } from './web-notification.service';

describe('notificationFactory', () => {
  const webNotificationService = {} as WebNotificationService;
  const desktopNotificationService = {} as DesktopNotificationService;
  const mobileNotificationService = {} as MobileNotificationService;

  function createFactory(platform: { isElectron: boolean; isMobile: boolean }) {
    return notificationFactory(
      platform as PlatformInformationService,
      webNotificationService,
      desktopNotificationService,
      mobileNotificationService,
    );
  }

  it('should return the desktop notification service on electron', () => {
    // Act
    const service = createFactory({ isElectron: true, isMobile: false });

    // Assert
    expect(service).toBe(desktopNotificationService);
  });

  it('should return the mobile notification service on mobile', () => {
    // Act
    const service = createFactory({ isElectron: false, isMobile: true });

    // Assert
    expect(service).toBe(mobileNotificationService);
  });

  it('should return the web notification service on web', () => {
    // Act
    const service = createFactory({ isElectron: false, isMobile: false });

    // Assert
    expect(service).toBe(webNotificationService);
  });
});

describe('NotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PlatformInformationService,
          useValue: { isElectron: false, isMobile: false },
        },
        {
          provide: ToastrService,
          useValue: { error: vi.fn(), success: vi.fn() },
        },
      ],
    });
  });

  it('should be provided through the platform factory', () => {
    // Act
    const service = TestBed.inject(NotificationService);

    // Assert
    expect(service).toBeInstanceOf(WebNotificationService);
  });
});
