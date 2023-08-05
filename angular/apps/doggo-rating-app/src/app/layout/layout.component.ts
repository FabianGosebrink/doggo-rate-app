import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  AuthActions,
  selectCurrentUserIdentifier,
  selectIsLoggedIn,
} from '@ps-doggo-rating/shared/util-auth';
import { environment } from '@ps-doggo-rating/shared/util-environments';
import {
  FooterComponent,
  NavigationComponent,
} from '@ps-doggo-rating/shared/ui-common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [FooterComponent, NavigationComponent, RouterModule, AsyncPipe],
})
export class LayoutComponent implements OnInit {
  private readonly store = inject(Store);

  isLoggedIn$: Observable<boolean>;
  userEmail$: Observable<string>;

  backendUrl = environment.server;

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.pipe(select(selectIsLoggedIn));
    this.userEmail$ = this.store.pipe(select(selectCurrentUserIdentifier));
  }

  login() {
    this.store.dispatch(AuthActions.login());
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
