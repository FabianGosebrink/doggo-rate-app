import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private modal: Window;
  private readonly oidcSecurityService = inject(OidcSecurityService);

  login() {
    this.oidcSecurityService.authorize();
  }

  checkAuth(url?: string) {
    return this.oidcSecurityService.checkAuth(url);
  }

  logout() {
    return this.oidcSecurityService.logoff();
  }
}
