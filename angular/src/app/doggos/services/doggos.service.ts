import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, timer, Observable } from 'rxjs';
import { Doggo } from '../models/doggo';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1568572933382-74d440642117?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80';

@Injectable({
  providedIn: 'root',
})
export class DoggosService {
  constructor(private http: HttpClient) {}

  getItems(): Observable<Doggo[]> {
    return this.http.get<Doggo[]>(`${environment.server}api/doggos`).pipe(
      map((x) =>
        x.map((doggo) => {
          return {
            ...doggo,
            imageUrl: IMAGE_URL,
          };
        })
      )
    );
  }

  update(doggo: Doggo): Observable<Doggo> {
    doggo.imageUrl = '';
    return this.http
      .put<Doggo>(`${environment.server}api/doggos/${doggo.id}`, doggo)
      .pipe(
        map((doggo) => {
          return {
            ...doggo,
            imageUrl: IMAGE_URL,
          };
        })
      );
  }
}
