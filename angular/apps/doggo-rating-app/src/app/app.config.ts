import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import * as fromAuth from '@ps-doggo-rating/shared/util-auth';
import { environment } from '@ps-doggo-rating/shared/util-environments';
import { realtimeReducer } from '@ps-doggo-rating/shared/util-real-time';
import { authInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { ToastrModule } from 'ngx-toastr';
import { APP_ROUTES } from './app-routes';

const authConfig = {
  config: {
    authority: 'https://dev-2fwvrhka.us.auth0.com',
    redirectUrl: window.location.origin,
    clientId: 'W6a2DDLMzlWPF6vZ5AKKNnFVonklSU0m',
    scope: 'openid profile email offline_access access:api',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    postLogoutRedirectUri: window.location.origin,
    customParamsAuthRequest: {
      audience: environment.server,
    },
    secureRoutes: [environment.server],
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideEffects(fromAuth.authEffects),
    provideStore({
      router: routerReducer,
      auth: fromAuth.authReducer,
      realtime: realtimeReducer,
    }),
    provideRouterStore(),
    provideAuth(authConfig),
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
      }),
      BrowserAnimationsModule
    ),
  ],
};
