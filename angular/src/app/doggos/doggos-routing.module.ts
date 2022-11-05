import { MainDoggoComponent } from './container/main-doggo/main-doggo.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddDoggoComponent } from './container/add-doggo/add-doggo.component';

const routes: Routes = [
  {
    path: '',
    component: MainDoggoComponent,
  },
  {
    path: 'add',
    component: AddDoggoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoggosRoutingModule {}
