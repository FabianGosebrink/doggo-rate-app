import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'doggos',
    loadChildren: () =>
      import('./doggos/doggos.module').then((m) => m.DoggosModule),
  },
  { path: '', redirectTo: '/doggos', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
