import { MainDoggoComponent } from './container/main-doggo/main-doggo.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDoggoComponent } from './container/add-doggo/add-doggo.component';
import { MyDoggosComponent } from './container/my-doggos/my-doggos.component';

const routes: Routes = [
  {
    path: '',
    component: MainDoggoComponent,
  },
  {
    path: 'my',
    component: MyDoggosComponent,
  },
  {
    path: 'my/add',
    component: AddDoggoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoggosRoutingModule {}
