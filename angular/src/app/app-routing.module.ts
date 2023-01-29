import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './shell/callback/callback.component';

export const routes: Routes = [
  {
    path: 'doggos',
    loadChildren: () =>
      import('./doggos/doggos.module').then((m) => m.DoggosModule),
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
