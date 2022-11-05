import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [LayoutComponent, NavigationComponent, FooterComponent],
  exports: [LayoutComponent],
  imports: [CommonModule, RouterModule],
})
export class ShellModule {}
