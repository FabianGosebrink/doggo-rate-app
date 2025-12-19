import { Routes } from '@angular/router';
import { LayoutComponent } from '@dog-rating/shared/ui-common';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dogs',
        loadChildren: () =>
          import('@dog-rating/dogs/feature').then((m) => m.DOGS_ROUTES),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('@dog-rating/about/feature').then((m) => m.ABOUT_ROUTES),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dogs',
      },
    ],
  },
];
