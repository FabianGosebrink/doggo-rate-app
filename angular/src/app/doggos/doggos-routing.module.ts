import { MainDoggoComponent } from './container/main-doggo/main-doggo.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDoggoComponent } from './container/add-doggo/add-doggo.component';
import { MyDoggosComponent } from './container/my-doggos/my-doggos.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainDoggoComponent,
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoggosRoutingModule {}
