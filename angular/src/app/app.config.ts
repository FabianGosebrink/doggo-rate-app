import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { authInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app-routes';
import * as authEffects from './auth/store/auth.effects';
import { authReducer } from './auth/store/auth.reducer';
import { realtimeReducer } from './common/real-time/store/realtime.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideEffects(authEffects),
    provideStore({
      router: routerReducer,
      auth: authReducer,
      realtime: realtimeReducer,
    }),
    provideRouterStore(),
    provideAuth({
      config: {
        authority: 'https://dev-2fwvrhka.us.auth0.com',
        redirectUrl: `${window.location.origin}/callback`,
        clientId: 'W6a2DDLMzlWPF6vZ5AKKNnFVonklSU0m',
        scope: 'openid profile email offline_access access:api',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        postLogoutRedirectUri: `${window.location.origin}/callback`,
        customParamsAuthRequest: {
          audience: environment.server,
        },
        secureRoutes: [environment.server],
      },
    }),
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
      }),
      BrowserAnimationsModule
    ),
  ],
};
