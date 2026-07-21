import { TestBed } from '@angular/core/testing';
import { PlatformInformationService } from '@dog-rating/shared/util-platform-information';
import { beforeEach, describe, expect, it } from 'vitest';
import { CameraService, cameraFactory } from './camera.service';
import { DesktopCameraService } from './desktop-camera.service';
import { MobileCameraService } from './mobile-camera.service';

describe('cameraFactory', () => {
  const desktopCameraService = {} as DesktopCameraService;
  const mobileCameraService = {} as MobileCameraService;

  it('should return the mobile camera service on mobile', () => {
    // Act
    const service = cameraFactory(
      { isMobile: true } as PlatformInformationService,
      desktopCameraService,
      mobileCameraService,
    );

    // Assert
    expect(service).toBe(mobileCameraService);
  });

  it('should return the desktop camera service on desktop', () => {
    // Act
    const service = cameraFactory(
      { isMobile: false } as PlatformInformationService,
      desktopCameraService,
      mobileCameraService,
    );

    // Assert
    expect(service).toBe(desktopCameraService);
  });
});

describe('CameraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PlatformInformationService,
          useValue: { isMobile: false },
        },
      ],
    });
  });

  it('should be provided through the platform factory', () => {
    // Act
    const service = TestBed.inject(CameraService);

    // Assert
    expect(service).toBeInstanceOf(DesktopCameraService);
  });
});
