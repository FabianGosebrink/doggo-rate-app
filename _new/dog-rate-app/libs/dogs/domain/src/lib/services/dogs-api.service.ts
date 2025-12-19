import { inject, Injectable } from '@angular/core';
import { HttpService } from '@dog-rating/shared/util-common';
import { environment } from '@dog-rating/shared/util-environments';
import { map, Observable } from 'rxjs';
import { Dog } from '../models/dog';

@Injectable({
  providedIn: 'root',
})
export class DogsApiService {
  private readonly http = inject(HttpService);

  getDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${environment.server}api/dogs`);
  }

  getSingleDog(id: string): Observable<Dog> {
    return this.http.get<Dog>(`${environment.server}api/dogs/${id}`);
  }

  getMyDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${environment.server}api/dogs/my`);
  }

  addDog(
    name: string,
    breed: string,
    comment: string,
    imageUrl: string,
  ): Observable<Dog> {
    const toSend = { name, breed, comment, imageUrl };

    return this.http.post<Dog>(`${environment.server}api/dogs`, toSend);
  }

  deleteDog(dog: Dog): Observable<Dog> {
    return this.http
      .delete(`${environment.server}api/dogs/${dog.id}`)
      .pipe(map(() => dog));
  }

  rate(id: string, value: number): Observable<Dog> {
    return this.http.put<Dog>(`${environment.server}api/dogs/rate/${id}`, {
      value,
    });
  }
}
