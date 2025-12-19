import { Routes } from '@angular/router';
import { isAuthenticated } from '@dog-rating/shared/util-auth';
import { AddDogComponent } from './add-dog/add-dog.component';
import { DogDetailComponent } from './dog-detail/dog-detail.component';
import { MainDogComponent } from './main-dog/main-dog.component';
import { MyDogsComponent } from './my-dogs/my-dogs.component';

export const DOGS_ROUTES: Routes = [
  {
    path: '',
    component: MainDogComponent,
  },
  {
    path: 'my',
    component: MyDogsComponent,
    canActivate: [isAuthenticated],
  },
  {
    path: 'my/add',
    component: AddDogComponent,
    canActivate: [isAuthenticated],
  },
  {
    path: 'details/:dogId',
    component: DogDetailComponent,
    canActivate: [isAuthenticated],
  },
];
