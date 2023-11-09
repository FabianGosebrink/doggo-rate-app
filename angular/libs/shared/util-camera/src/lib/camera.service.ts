import { Injectable } from '@angular/core';
import { PlatformInformationService } from '@ps-doggo-rating/shared/util-platform-information';
import { Observable } from 'rxjs';
import { MobileCameraService } from './mobile-camera.service';
import { DesktopCameraService } from './desktop-camera.service';

export function cameraFactory(
  platformInformationService: PlatformInformationService,
  desktopCameraService: DesktopCameraService,
  mobileCameraService: MobileCameraService
): CameraService {
  const { isMobile } = platformInformationService;

  return isMobile ? mobileCameraService : desktopCameraService;
}

@Injectable({
  providedIn: 'root',
  useFactory: cameraFactory,
  deps: [PlatformInformationService, DesktopCameraService, MobileCameraService],
})
export abstract class CameraService {
  abstract getPhoto(): Observable<{
    formData: FormData;
    fileName: string;
    base64: string;
  }>;
}
