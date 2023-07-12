import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import {
  AuthInterceptor,
  AuthModule,
  StsConfigLoader,
  StsConfigStaticLoader,
} from 'angular-auth-oidc-client';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app-routes';
import * as authEffects from './auth/store/auth.effects';
import { authReducer } from './auth/store/auth.reducer';
import { PlatformInformationService } from './common/platform-information/platform-information.service';

const mobileCallbackUrl = `com.example.app://dev-2fwvrhka.us.auth0.com/capacitor/com.example.app/callback`;
const webCallbackUrl = `${window.location.origin}/callback`;
const desktopCallbackUrl = `http://localhost/callback`;

const authFactory = (
  platformInformationService: PlatformInformationService
) => {
  let redirectUrl = webCallbackUrl;
  let postLogoutRedirectUri = webCallbackUrl;
  if (platformInformationService.isElectron) {
    redirectUrl = desktopCallbackUrl;
    postLogoutRedirectUri = desktopCallbackUrl;
  } else if (platformInformationService.isMobile) {
    redirectUrl = mobileCallbackUrl;
    postLogoutRedirectUri = mobileCallbackUrl;
  }

  const config = {
    authority: 'https://dev-2fwvrhka.us.auth0.com',
    redirectUrl,
    clientId: 'W6a2DDLMzlWPF6vZ5AKKNnFVonklSU0m',
    scope: 'openid profile email offline_access access:api',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    postLogoutRedirectUri,
    customParamsAuthRequest: {
      audience: environment.server,
    },
    secureRoutes: [environment.server],
  };
  return new StsConfigStaticLoader(config);
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideRouter(APP_ROUTES),
    provideHttpClient(),
    provideEffects(authEffects),
    provideStore({
      router: routerReducer,
      auth: authReducer,
    }),
    provideRouterStore(),
    importProvidersFrom(
      AuthModule.forRoot({
        loader: {
          provide: StsConfigLoader,
          useFactory: authFactory,
          deps: [PlatformInformationService],
        },
      }),
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
      }),
      BrowserAnimationsModule
    ),
  ],
};
