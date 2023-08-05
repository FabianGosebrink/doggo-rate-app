import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app-routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects, authReducer } from '@ps-doggo-rating/shared/util-auth';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@ps-doggo-rating/shared/util-environments';
import { AuthInterceptor, AuthModule } from 'angular-auth-oidc-client';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideRouter(APP_ROUTES),
    provideHttpClient(),
    importProvidersFrom(
      StoreModule.forRoot({
        router: routerReducer,
        auth: authReducer,
      }),
      EffectsModule.forRoot([AuthEffects]),
      StoreRouterConnectingModule.forRoot(),
      StoreDevtoolsModule.instrument({
        maxAge: 25,
        logOnly: environment.production,
      }),
      AuthModule.forRoot({
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
      }),
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
      }),
      BrowserAnimationsModule
    ),
  ],
};
