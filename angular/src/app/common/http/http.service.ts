import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private readonly http: HttpClient) {}

  get<T>(url: string, options?: {}): Observable<T> {
    return this.http.get<T>(url, options);
  }

  post<T>(url: string, body: any, options?: {}): Observable<T> {
    return this.http.post<T>(url, body, options);
  }

  put<T>(url: string, body: any, options?: {}): Observable<T> {
    return this.http.put<T>(url, body, options);
  }

  delete<T>(url: string, options?: {}): Observable<T> {
    return this.http.delete<T>(url, options);
  }
}
