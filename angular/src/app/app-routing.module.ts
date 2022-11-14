import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CallbackComponent } from './shell/callback/callback.component';

export const routes: Routes = [
  {
    path: 'doggos',
    loadChildren: () =>
      import('./doggos/doggos.module').then((m) => m.DoggosModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./about/about.module').then((m) => m.AboutModule),
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
