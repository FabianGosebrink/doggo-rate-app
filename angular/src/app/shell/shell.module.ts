import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  declarations: [LayoutComponent, NavigationComponent],
  exports: [LayoutComponent],
  imports: [CommonModule, RouterModule],
})
export class ShellModule {}
