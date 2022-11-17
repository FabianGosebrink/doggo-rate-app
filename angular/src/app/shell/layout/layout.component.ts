import { AuthActions } from './../../auth/store/auth.actions';
import { selectIsLoggedIn } from './../../auth/store/auth.selectors';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getMyDoggosCount } from '../../doggos/store/doggos.selectors';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  myDoggoCount$: Observable<number>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.pipe(select(selectIsLoggedIn));
    this.myDoggoCount$ = this.store.pipe(select(getMyDoggosCount));
  }

  login() {
    this.store.dispatch(AuthActions.login());
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
