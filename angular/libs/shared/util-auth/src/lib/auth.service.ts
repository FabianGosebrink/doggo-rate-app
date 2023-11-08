import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { PlatformInformationService } from '@ps-doggo-rating/shared/util-platform-information';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oidcSecurityService = inject(OidcSecurityService);

  private readonly platformInformationService = inject(
    PlatformInformationService
  );

  private modal: Window | null = null;

  login() {
    if (this.platformInformationService.isElectron) {
      const urlHandler = (authUrl) => {
        this.modal = window.open(authUrl, '_blank', 'nodeIntegration=no');
      };

      return this.oidcSecurityService.authorize(null, { urlHandler });
    } else {
      this.oidcSecurityService.authorize();
    }
  }

  checkAuth(url?: string) {
    if (this.modal) {
      this.modal.close();
    }

    return this.oidcSecurityService.checkAuth(url);
  }

  logout() {
    return this.oidcSecurityService.logoff();
  }
}
