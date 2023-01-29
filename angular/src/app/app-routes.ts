import { Routes } from '@angular/router';
import { CallbackComponent } from './shell/callback/callback.component';

export const APP_ROUTES: Routes = [
  {
    path: 'doggos',
    loadChildren: () => import('./doggos').then((m) => m.DOGGOS_ROUTES),
  },
  {
    path: 'about',
    loadChildren: () => import('./about').then((m) => m.ABOUT_ROUTES),
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
  { path: '', redirectTo: '/doggos', pathMatch: 'full' },
];
