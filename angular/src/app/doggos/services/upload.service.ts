import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  upload(formData: FormData) {
    return this.http.post<{ path: string }>(
      `${environment.server}api/upload/image`,
      formData
    );
  }
}
