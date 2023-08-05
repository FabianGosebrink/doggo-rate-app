import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  FooterComponent,
  NavigationComponent,
} from '@ps-doggo-rating/shared/ui-common';
import {
  AuthActions,
  selectCurrentUserIdentifier,
  selectIsLoggedIn,
} from '@ps-doggo-rating/shared/util-auth';
import { environment } from '@ps-doggo-rating/shared/util-environments';
import { getRealTimeConnection } from '@ps-doggo-rating/shared/util-real-time';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [FooterComponent, NavigationComponent, RouterModule, AsyncPipe],
})
export class LayoutComponent {
  private readonly store = inject(Store);

  realTimeConnection = this.store.selectSignal(getRealTimeConnection);
  isLoggedIn = this.store.selectSignal(selectIsLoggedIn);
  userEmail = this.store.selectSignal(selectCurrentUserIdentifier);

  backendUrl = environment.server;

  login() {
    this.store.dispatch(AuthActions.login());
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
