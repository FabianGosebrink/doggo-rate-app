import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { from, Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CameraService } from './camera.service';
import { getFilename, urlToFile } from './utils';

@Injectable({ providedIn: 'root' })
export class DesktopCameraService implements CameraService {
  readonly #window = inject(DOCUMENT).defaultView;

  getPhoto(): Observable<{
    formData: FormData;
    fileName: string;
    base64: string;
  } | null> {
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
        const tracks = stream.getVideoTracks();
        if (tracks.length === 0) {
          return of(null);
        }

        return timer(300).pipe(
          map(() => this.captureFrame(stream)),
          tap(() => tracks.forEach((track) => track.stop())),
        );
      }),
      catchError(() => of(null)),
    );
  }

  private captureFrame(stream: MediaStream) {
    const video = this.#window!.document.createElement('video');
    const canvas = this.#window!.document.createElement('canvas');
    const settings = stream.getVideoTracks()[0].getSettings();

    video.srcObject = stream;
    video.play();

    canvas.width = settings.width || 1280;
    canvas.height = settings.height || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/png');
    const fileName = getFilename('desktop-web', '.png');
    const file = urlToFile(base64, fileName);

    const formData = new FormData();
    formData.append(fileName, file);

    // Cleanup video element reference
    video.srcObject = null;

    return { formData, fileName, base64 };
  }
}
