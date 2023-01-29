import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthGuard } from '../auth/auth.guard';
import { AddDoggoComponent } from './container/add-doggo/add-doggo.component';
import { MainDoggoComponent } from './container/main-doggo/main-doggo.component';
import { MyDoggosComponent } from './container/my-doggos/my-doggos.component';
import { DoggosEffects } from './store/doggos.effects';
import { doggosReducer } from './store/doggos.reducer';
import { featureName } from './store/doggos.state';

export const DOGGOS_ROUTES: Routes = [
  {
    path: '',
    component: MainDoggoComponent,
    providers: [
      importProvidersFrom(
        // register feature reducer
        StoreModule.forFeature(featureName, doggosReducer),
        // run feature effects
        EffectsModule.forFeature([DoggosEffects])
      ),
    ],
  },
  {
    path: 'my',
    component: MyDoggosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my/add',
    component: AddDoggoComponent,
    canActivate: [AuthGuard],
  },
];
