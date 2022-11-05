import { ShellModule } from './shell/shell.module';
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Capacitor } from '@capacitor/core';
import { environment } from '../environments/environment';

const IS_NATIVE = new InjectionToken<string>('is_native');

const platformFactory = () => {
  return Capacitor.isNativePlatform();
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ShellModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
      router: routerReducer,
    }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [{ provide: IS_NATIVE, useFactory: platformFactory }],
  bootstrap: [AppComponent],
})
export class AppModule {}
