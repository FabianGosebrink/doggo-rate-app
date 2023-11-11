import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { createFeature, provideState } from '@ngrx/store';
import {
  doggoEffects,
  doggosReducer,
  featureName,
} from '@ps-doggo-rating/doggos/domain';
import { isAuthenticated } from '@ps-doggo-rating/shared/util-auth';
import { AddDoggoComponent } from './add-doggo/add-doggo.component';
import { DoggoDetailComponent } from './doggo-detail/doggo-detail.component';
import { MainDoggoComponent } from './main-doggo/main-doggo.component';
import { MyDoggosComponent } from './my-doggos/my-doggos.component';

export const doggosFeature = createFeature({
  name: featureName,
  reducer: doggosReducer,
});

export const DOGGOS_ROUTES: Routes = [
  {
    path: '',
    component: MainDoggoComponent,
    providers: [provideState(doggosFeature), provideEffects(doggoEffects)],
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
    path: 'details/:id',
    component: DoggoDetailComponent,
    canActivate: [isAuthenticated],
  },
];
