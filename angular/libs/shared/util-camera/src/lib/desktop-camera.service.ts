import { Injectable, inject } from '@angular/core';
import { CameraService } from './camera.service';
import { DOCUMENT } from '@angular/common';
import { Observable, from, map, of, switchMap, throwError } from 'rxjs';
import { decode } from 'base64-arraybuffer';

@Injectable({ providedIn: 'root' })
export class DesktopCameraService implements CameraService {
  private readonly window = inject<Document>(DOCUMENT)?.defaultView;

  public getPhoto(): Observable<{
    formData: FormData;
    fileName: string;
    base64: string;
  }> {
    if (!this.window) {
      return throwError(() => 'No window available');
    }

    if (!this.window?.navigator?.mediaDevices?.getUserMedia) {
      return throwError(() => 'No media devices available');
    }

    const promise = this.window.navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        return new Promise<{
          formData: FormData;
          fileName: string;
          base64: string;
        }>((resolve, reject) => {
          const hasMedia = stream.getVideoTracks().length > 0;

          if (!hasMedia) {
            return reject(() => 'No media devices available');
          }

          const videoElement = this.window?.document.createElement('video');
          let canvas = this.window?.document.createElement('canvas');

          if (!canvas || !videoElement) {
            return reject(() => 'No canvas or video element available');
          }
          const streamSettings = stream.getVideoTracks()[0].getSettings();
          videoElement.srcObject = stream;
          videoElement.play();

          canvas.width = streamSettings.width || 1280;
          canvas.height = streamSettings.height || 720;

          setTimeout(() => {
            if (!canvas || !videoElement) {
              return reject(() => 'No canvas or video element available');
            }

            let ctx = canvas.getContext('2d');

            if (!ctx) {
              return throwError(() => 'No canvas context available');
            }

            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            const image = canvas.toDataURL('image/png');
            console.log(image);

            if (stream.getVideoTracks) {
              stream.getVideoTracks().forEach((track) => {
                track.stop();
              });
            }

            const fileName = `image-${Math.random()
              .toString(36)
              .slice(2, 7)}.jpg`;
            const blob = new Blob([new Uint8Array(decode(image))], {
              type: `image/png`,
            });
            const file = new File([blob], fileName);
            const formData = new FormData();

            formData.append(fileName, file);

            resolve({ formData, fileName, base64: image });
          }, 300);
        });
      });

    return from(promise);
  }
}
