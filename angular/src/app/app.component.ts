import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthActions } from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ratemydoggo';

  constructor(
    private store: Store,
    private zone: NgZone,
    private oidcSecurityService: OidcSecurityService
  ) {}

  ngOnInit(): void {
    this.checkAuth('');

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        this.checkAuth(event.url);
      });
    });
  }

  private checkAuth(url: string) {
    this.oidcSecurityService
      .checkAuth(url)
      .subscribe((response: LoginResponse) => {
        console.log('app', response);
        this.store.dispatch(
          AuthActions.loginComplete({
            isLoggedIn: response.isAuthenticated,
            profile: response.userData,
          })
        );
      });
  }
}
