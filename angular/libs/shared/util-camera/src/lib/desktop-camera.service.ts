import { Injectable, inject } from '@angular/core';
import { CameraService } from './camera.service';
import { DOCUMENT } from '@angular/common';
import { Observable, from, throwError } from 'rxjs';
import { getFilename } from './utils';

@Injectable({ providedIn: 'root' })
export class DesktopCameraService implements CameraService {
  private readonly window = inject<Document>(DOCUMENT)?.defaultView;

  getPhoto(): Observable<{
    formData: FormData;
    fileName: string;
    base64: string;
  }> {
    if (!this.window) {
      return throwError(() => 'No window available');
    }

    if (!this.window.navigator?.mediaDevices?.getUserMedia) {
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
          const canvas = this.window?.document.createElement('canvas');

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

            const ctx = canvas.getContext('2d');

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
            const fileName = getFilename('desktop-web', '.png');
            const file = this.urlToFile(image, fileName);
            const formData = new FormData();

            formData.append(fileName, file);

            resolve({ formData, fileName, base64: image });
          }, 300);
        });
      });

    return from(promise);
  }

  private urlToFile(url: string, filename: string): File {
    const arr = url.split(',');
    const bstr = atob(arr[arr.length - 1]);

    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: 'image/png' });
  }
}
