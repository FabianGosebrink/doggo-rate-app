import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './container/about/about.component';
import { AboutRoutingModule } from './about-routing.module';

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, AboutRoutingModule],
})
export class AboutModule {}
