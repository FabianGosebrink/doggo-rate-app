import { Injectable, inject } from '@angular/core';
import { environment } from '@ps-doggo-rating/shared/util-environments';
import { HttpService } from '@ps-doggo-rating/shared/util-common';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpService);

  upload(formData: FormData) {
    return this.http.post<{ path: string }>(
      `${environment.server}api/upload/image`,
      formData
    );
  }
}
