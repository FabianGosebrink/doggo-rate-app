import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FooterComponent,
  NavigationComponent,
} from '@ps-doggo-rating/shared/ui-common';
import { AuthStore } from '@ps-doggo-rating/shared/util-auth';
import { environment } from '@ps-doggo-rating/shared/util-environments';
import { PlatformInformationService } from '@ps-doggo-rating/shared/util-platform-information';
import { RealTimeStore } from '@ps-doggo-rating/shared/util-real-time';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [FooterComponent, NavigationComponent, RouterModule],
})
export class LayoutComponent {
  realTimeStore = inject(RealTimeStore);
  authStore = inject(AuthStore);

  platform = inject(PlatformInformationService).platform;

  backendUrl = environment.server;

  login(): void {
    this.authStore.login();
  }

  logout(): void {
    this.authStore.logout();
  }
}
