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
  }> {
    if (!this.window) {
      return throwError(() => 'No window available');
    }

    if (!this.window?.navigator?.mediaDevices?.getUserMedia) {
      return throwError(() => 'No media devices available');
    }

    return from(
      this.window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })
    ).pipe(
      switchMap((stream) => {
        const hasMedia = stream.getVideoTracks().length > 0;

        if (!hasMedia) {
          return throwError(() => 'No media devices available');
        }

        const videoElement = this.window?.document.createElement('video');
        let canvas = this.window?.document.createElement('canvas');

        if (!canvas || !videoElement) {
          return throwError(() => 'No canvas or video element available');
        }

        canvas.width = 1920;
        canvas.height = 1080;

        let ctx = canvas.getContext('2d');

        if (!ctx) {
          return throwError(() => 'No canvas context available');
        }

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const image = canvas.toDataURL('image/jpeg');
        console.log(image);

        if (stream.getAudioTracks) {
          stream.getAudioTracks().forEach((track) => {
            track.stop();
          });
        }

        if (stream.getVideoTracks) {
          stream.getVideoTracks().forEach((track) => {
            track.stop();
          });
        }

        const fileName = `image-${Math.random().toString(36).slice(2, 7)}.jpg`;
        const blob = new Blob([new Uint8Array(decode(image))], {
          type: `image/jpeg`,
        });
        const file = new File([blob], fileName);
        const formData = new FormData();

        formData.append(fileName, file);

        return of({ formData, fileName });
      })
    );
  }
}
