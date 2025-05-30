import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { environment } from '@doggo-rating/shared/util-environments';
import {
  authInterceptor,
  provideAuth,
  StsConfigLoader,
  StsConfigStaticLoader,
} from 'angular-auth-oidc-client';
import { ToastrModule } from 'ngx-toastr';
import { APP_ROUTES } from './app-routes';
import { PlatformInformationService } from '@doggo-rating/shared/util-platform-information';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const mobileCallbackUrl = `com.example.app://dev-2fwvrhka.us.auth0.com/capacitor/com.example.app/callback`;
const webCallbackUrl = `${window.location.origin}/callback`;
const desktopCallbackUrl = `http://localhost/callback`;

const authFactory = (
  platformInformationService: PlatformInformationService,
): StsConfigStaticLoader => {
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
    provideAnimationsAsync(),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideAuth({
      loader: {
        provide: StsConfigLoader,
        useFactory: authFactory,
        deps: [PlatformInformationService],
      },
    }),
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
      }),
    ),
  ],
};
