import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../common/http/http.service';
import { environment } from './../../../environments/environment';

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
