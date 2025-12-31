import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '@dog-rating/shared/util-auth';
import { environment } from '@dog-rating/shared/util-environments';
import { PlatformInformationService } from '@dog-rating/shared/util-platform-information';
import { RealTimeStore } from '@dog-rating/shared/util-real-time';
import { FooterComponent } from '../footer/footer.component';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'lib-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [FooterComponent, NavigationComponent, RouterModule],
})
export class LayoutComponent {
  realTimeStore = inject(RealTimeStore);
  authStore = inject(AuthStore);

  platform = inject(PlatformInformationService).platform;

  backendUrl = environment.server;
}
