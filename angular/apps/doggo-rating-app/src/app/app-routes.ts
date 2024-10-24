import { Routes } from '@angular/router';
import { CallbackComponent } from '@doggo-rating/shared/util-auth';

export const APP_ROUTES: Routes = [
  {
    path: 'doggos',
    loadChildren: () =>
      import('@doggo-rating/doggos/feature').then((m) => m.DOGGOS_ROUTES),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('@doggo-rating/about/feature').then((m) => m.ABOUT_ROUTES),
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
  { path: '', redirectTo: '/doggos', pathMatch: 'full' },
];
