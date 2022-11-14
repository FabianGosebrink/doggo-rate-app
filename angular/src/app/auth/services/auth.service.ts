import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { PlatformInformationService } from '../../common/platform-information.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private modal: Window;

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private platformInformationService: PlatformInformationService
  ) {}

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
    return this.oidcSecurityService.logoffAndRevokeTokens();
  }
}
