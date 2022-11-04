import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, timer, Observable } from 'rxjs';
import { Doggo } from '../models/doggo';

const doggos: Doggo[] = [
  {
    id: '1',
    breed: 'Husky',
    name: 'Hector',
    comment: 'Goodest Boi',
    imageUrl:
      'https://images.unsplash.com/photo-1568572933382-74d440642117?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
    ratings: [],
  },
  {
    id: '2',
    breed: 'Flatcoat Retriever',
    name: 'Elvis',
    comment: 'Goodest Boi',
    imageUrl:
      'https://images.unsplash.com/photo-1534351450181-ea9f78427fe8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
    ratings: [],
  },
  {
    id: '3',
    breed: 'Golden Retriever',
    name: 'Ludwig',
    comment: 'Goodest Boi',
    imageUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=962&q=80',
    ratings: [],
  },
  {
    id: '4',
    breed: 'Border Collie',
    name: 'Carla',
    comment: 'Goodest Boi',
    imageUrl:
      'https://images.unsplash.com/photo-1591946559594-8c6d3b7391eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
    ratings: [],
  },
  {
    id: '5',
    breed: 'Border Collie',
    name: 'Louis',
    comment: 'Goodest Boi',
    imageUrl:
      'https://images.unsplash.com/photo-1604165094771-7af34f7fd4cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
    ratings: [],
  },
];

@Injectable({
  providedIn: 'root',
})
export class DoggosService {
  constructor(private http: HttpClient) {}

  getItems(): Observable<Doggo[]> {
    return timer(2000).pipe(map(() => doggos));
  }
}
