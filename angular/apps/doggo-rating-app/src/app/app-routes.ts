import { Routes } from '@angular/router';
import { CallbackComponent } from '@doggo-rating/shared/util-auth';
import { LayoutComponent } from '@doggo-rating/shared/ui-common';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dogs',
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
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dogs',
      },
    ],
  },
];
