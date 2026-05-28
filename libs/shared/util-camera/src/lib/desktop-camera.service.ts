import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CameraService } from './camera.service';
import { getFilename, urlToFile } from './utils';

type Capture = { formData: FormData; fileName: string; base64: string };

// Give the webcam time to adjust exposure/white balance before capturing.
const WARMUP_MS = 1500;

@Injectable({ providedIn: 'root' })
export class DesktopCameraService implements CameraService {
  readonly #window = inject(DOCUMENT).defaultView;

  getPhoto(): Observable<Capture | null> {
    if (!this.#window?.navigator?.mediaDevices?.getUserMedia) {
      return of(null);
    }

    return from(
      this.#window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      }),
    ).pipe(
      switchMap((stream) => {
        if (stream.getVideoTracks().length === 0) {
          return of(null);
        }
        return from(this.captureFrame(stream));
      }),
      catchError(() => of(null)),
    );
  }

  private captureFrame(stream: MediaStream): Promise<Capture | null> {
    const win = this.#window!;
    const video = win.document.createElement('video');
    const canvas = win.document.createElement('canvas');

    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      stream.getVideoTracks().forEach((track) => track.stop());
      video.srcObject = null;
    };

    return new Promise<Capture | null>((resolve) => {
      const draw = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          resolve(null);
          return;
        }

        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const base64 = canvas.toDataURL('image/png');
        const fileName = getFilename('desktop-web', '.png');
        const file = urlToFile(base64, fileName);
        const formData = new FormData();
        formData.append(fileName, file);

        cleanup();
        resolve({ formData, fileName, base64 });
      };

      video.onloadedmetadata = () => {
        video.play().catch(() => {
          cleanup();
          resolve(null);
        });
      };

      // `playing` fires once frames are flowing. Wait WARMUP_MS so the webcam
      // can settle exposure/white balance, then RAF to guarantee a decoded
      // frame is on screen before we draw to the canvas.
      video.onplaying = () => {
        win.setTimeout(() => {
          win.requestAnimationFrame(() => draw());
        }, WARMUP_MS);
      };
    });
  }
}
