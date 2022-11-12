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
    this.oidcSecurityService
      .checkAuth()
      .subscribe((response: LoginResponse) => {
        console.log('app', response);
        this.store.dispatch(
          AuthActions.loginComplete({
            isLoggedIn: response.isAuthenticated,
            profile: response.userData,
          })
        );
      });

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        // // Example url: https://beerswift.app/tabs/tab2
        // // slug = /tabs/tab2
        // const slug = event.url.split(".app").pop();
        // if (slug) {
        //     this.router.navigateByUrl(slug);
        // }
        // // If no match, do nothing - let regular routing
        // // logic take over

        this.oidcSecurityService
          .checkAuth(event.url)
          .subscribe((response: LoginResponse) => {
            console.log('app', response);
            this.store.dispatch(
              AuthActions.loginComplete({
                isLoggedIn: response.isAuthenticated,
                profile: response.userData,
              })
            );
          });

        console.log(event);
      });
    });
  }
}
