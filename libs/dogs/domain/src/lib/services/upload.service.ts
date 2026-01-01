import { inject, Injectable } from '@angular/core';
import { environment } from '@dog-rating/shared/util-environments';
import { HttpService } from '@dog-rating/shared/util-common';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  readonly #http = inject(HttpService);

  upload(formData: FormData): Observable<{ path: string }> {
    return this.#http.post<{ path: string }>(
      `${environment.server}api/upload/image`,
      formData,
    );
  }
}
