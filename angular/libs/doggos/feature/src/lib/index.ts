import { Routes } from '@angular/router';
import { isAuthenticated } from '@ps-doggo-rating/shared/util-auth';
import { AddDoggoComponent } from './add-doggo/add-doggo.component';
import { DoggoDetailComponent } from './doggo-detail/doggo-detail.component';
import { MainDoggoComponent } from './main-doggo/main-doggo.component';
import { MyDoggosComponent } from './my-doggos/my-doggos.component';

export const DOGGOS_ROUTES: Routes = [
  {
    path: '',
    component: MainDoggoComponent,
  },
  {
    path: 'my',
    component: MyDoggosComponent,
    canActivate: [isAuthenticated],
  },
  {
    path: 'my/add',
    component: AddDoggoComponent,
    canActivate: [isAuthenticated],
  },
  {
    path: 'details/:doggoId',
    component: DoggoDetailComponent,
    canActivate: [isAuthenticated],
  },
];
