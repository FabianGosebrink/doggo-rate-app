import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { from, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MobileCameraService {
  getPhoto(): Observable<FormData> {
    return from(
      Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
      })
    ).pipe(
      map((photo) => {
        const blob = this.dataUriToBlob(photo.dataUrl);
        const formData = new FormData();
        formData.append('image.jpg', blob);

        return formData;
      })
    );
  }

  private dataUriToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? Buffer.from(splitDataURI[1]).toString('base64')
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }
}
