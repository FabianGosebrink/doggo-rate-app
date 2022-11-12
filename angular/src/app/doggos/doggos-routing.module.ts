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
    path: 'add',
    component: AddDoggoComponent,
  },
  {
    path: 'my',
    component: MyDoggosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoggosRoutingModule {}
