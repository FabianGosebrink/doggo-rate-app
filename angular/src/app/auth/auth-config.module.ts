import { environment } from '../../environments/environment';
import { NgModule } from '@angular/core';
import {
  AuthModule,
  StsConfigLoader,
  StsConfigStaticLoader,
} from 'angular-auth-oidc-client';
import { IS_NATIVE } from '../common/is-native';

const callbackUri = `com.example.app://dev-2fwvrhka.us.auth0.com/capacitor/com.example.app/callback`;

const authFactory = (isNative: boolean) => {
  const config = {
    authority: 'https://dev-2fwvrhka.us.auth0.com',
    redirectUrl: isNative ? callbackUri : window.location.origin,
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
  };
  return new StsConfigStaticLoader(config);
};

@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: authFactory,
        deps: [IS_NATIVE],
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
