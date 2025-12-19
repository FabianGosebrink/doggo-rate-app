import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http = inject(HttpClient);

  get<T>(url: string, options?: object): Observable<T> {
    return this.http.get<T>(url, options);
  }

  post<T>(url: string, body: unknown, options?: object): Observable<T> {
    return this.http.post<T>(url, body, options);
  }

  put<T>(url: string, body: unknown, options?: object): Observable<T> {
    return this.http.put<T>(url, body, options);
  }

  delete<T>(url: string, options?: object): Observable<T> {
    return this.http.delete<T>(url, options);
  }
}
