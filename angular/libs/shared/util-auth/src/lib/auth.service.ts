import { Injectable, inject } from '@angular/core';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { PlatformInformationService } from '@ps-doggo-rating/shared/util-platform-information';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oidcSecurityService = inject(OidcSecurityService);

  private readonly platformInformationService = inject(
    PlatformInformationService
  );

  private modal: Window | null = null;

  login(): void {
    if (this.platformInformationService.isElectron) {
      const urlHandler = (authUrl): void => {
        this.modal = window.open(authUrl, '_blank', 'nodeIntegration=no');
      };

      return this.oidcSecurityService.authorize(null, { urlHandler });
    } else {
      this.oidcSecurityService.authorize();
    }
  }

  checkAuth(url?: string): Observable<LoginResponse> {
    if (this.modal) {
      this.modal.close();
    }

    return this.oidcSecurityService.checkAuth(url);
  }

  logout(): Observable<unknown> {
    return this.oidcSecurityService.logoff();
  }
}
