import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  DoggosEffects,
  doggosReducer,
  featureName,
} from '@ps-doggo-rating/doggos/domain';
import { isAuthenticated } from '@ps-doggo-rating/shared/util-auth';
import { AddDoggoComponent } from './add-doggo/add-doggo.component';
import { MainDoggoComponent } from './main-doggo/main-doggo.component';
import { MyDoggosComponent } from './my-doggos/my-doggos.component';

export const DOGGOS_ROUTES: Routes = [
  {
    path: '',
    component: MainDoggoComponent,
    providers: [
      importProvidersFrom(
        StoreModule.forFeature(featureName, doggosReducer),
        EffectsModule.forFeature([DoggosEffects])
      ),
    ],
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
];
