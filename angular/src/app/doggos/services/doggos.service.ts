import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '../../common/http/http.service';
import { Doggo } from '../models/doggo';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DoggosService {
  private readonly http = inject(HttpService);

  getDoggos(): Observable<Doggo[]> {
    return this.http.get<Doggo[]>(`${environment.server}api/doggos`);
  }

  getMyDoggos(): Observable<Doggo[]> {
    return this.http.get<Doggo[]>(`${environment.server}api/doggos/my`);
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

  rate(id: string, value: number): Observable<Doggo> {
    return this.http.put<Doggo>(`${environment.server}api/doggos/rate/${id}`, {
      value,
    });
  }
}
