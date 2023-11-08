import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { from, map, Observable } from 'rxjs';
import { decode } from 'base64-arraybuffer';

@Injectable({ providedIn: 'root' })
export class MobileCameraService {
  getPhoto(): Observable<{ formData: FormData; fileName: string }> {
    return from(
      Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      })
    ).pipe(
      map((photo) => {
        const base64 = photo.base64String as string;
        const blob = new Blob([new Uint8Array(decode(base64))], {
          type: `image/${photo.format}`,
        });
        const fileName = `mobile-image-${Math.random()
          .toString(36)
          .slice(2, 7)}.jpg`;
        const file = new File([blob], fileName);
        const formData = new FormData();

        formData.append(fileName, file);

        return { formData, fileName };
      })
    );
  }
}
