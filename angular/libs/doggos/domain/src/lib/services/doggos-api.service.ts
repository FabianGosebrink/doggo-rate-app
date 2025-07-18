import { inject, Injectable } from '@angular/core';
import { HttpService } from '@doggo-rating/shared/util-common';
import { environment } from '@doggo-rating/shared/util-environments';
import { map, Observable } from 'rxjs';
import { Doggo } from '../models/doggo';

@Injectable({
  providedIn: 'root',
})
export class DoggosApiService {
  private readonly http = inject(HttpService);

  getDoggos(): Observable<Doggo[]> {
    return this.http.get<Doggo[]>(`${environment.server}api/dogs`);
  }

  getSingleDoggo(id: string): Observable<Doggo> {
    return this.http.get<Doggo>(`${environment.server}api/dogs/${id}`);
  }

  getMyDoggos(): Observable<Doggo[]> {
    return this.http.get<Doggo[]>(`${environment.server}api/dogs/my`);
  }

  addDoggo(
    name: string,
    breed: string,
    comment: string,
    imageUrl: string,
  ): Observable<Doggo> {
    const toSend = { name, breed, comment, imageUrl };

    return this.http.post<Doggo>(`${environment.server}api/dogs`, toSend);
  }

  deleteDoggo(doggo: Doggo): Observable<Doggo> {
    return this.http
      .delete(`${environment.server}api/dogs/${doggo.id}`)
      .pipe(map(() => doggo));
  }

  rate(id: string, value: number): Observable<Doggo> {
    return this.http.put<Doggo>(`${environment.server}api/dogs/rate/${id}`, {
      value,
    });
  }
}
