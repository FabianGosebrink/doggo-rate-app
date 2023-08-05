import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oidcSecurityService = inject(OidcSecurityService);

  private modal: Window | null = null;

  login() {
    this.oidcSecurityService.authorize();
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
