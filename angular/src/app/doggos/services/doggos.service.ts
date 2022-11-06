import { HttpService } from './../../common/http.service';
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { map, timer, Observable } from 'rxjs';
import { Doggo } from '../models/doggo';

@Injectable({
  providedIn: 'root',
})
export class DoggosService {
  constructor(private http: HttpService) {}

  getDoggos(): Observable<Doggo[]> {
    return this.http.get<Doggo[]>(`${environment.server}api/doggos`);
  }

  addDoggo(
    name: string,
    breed: string,
    comment: string,
    imageUrl: string
  ): Observable<Doggo> {
    const toSend = { name, breed, comment, imageUrl };

    return this.http.post<Doggo>(`${environment.server}api/doggos`, toSend);
  }

  deleteDoggo(doggo: Doggo): Observable<Doggo> {
    return this.http
      .delete(`${environment.server}api/doggos/${doggo.id}`)
      .pipe(map(() => doggo));
  }

  update(doggo: Doggo): Observable<Doggo> {
    return this.http.put<Doggo>(
      `${environment.server}api/doggos/${doggo.id}`,
      doggo
    );
  }
}
