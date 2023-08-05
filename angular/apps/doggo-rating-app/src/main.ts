import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from '@ps-doggo-rating/shared/util-environments';
import { enableProdMode } from '@angular/core';

console.log('Running with endpoint', environment.server);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig);
