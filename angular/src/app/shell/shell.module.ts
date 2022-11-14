import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { CallbackComponent } from './callback/callback.component';

@NgModule({
  declarations: [LayoutComponent, NavigationComponent, FooterComponent, CallbackComponent],
  exports: [LayoutComponent],
  imports: [CommonModule, RouterModule],
})
export class ShellModule {}
