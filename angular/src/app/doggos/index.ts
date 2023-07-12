import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { createFeature, provideState } from '@ngrx/store';
import { isAuthenticated } from '../auth/auth.guard';
import { AddDoggoComponent } from './container/add-doggo/add-doggo.component';
import { MainDoggoComponent } from './container/main-doggo/main-doggo.component';
import { MyDoggosComponent } from './container/my-doggos/my-doggos.component';
import * as doggoEffects from './store/doggos.effects';
import { doggosReducer } from './store/doggos.reducer';
import { featureName } from './store/doggos.state';

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
];
