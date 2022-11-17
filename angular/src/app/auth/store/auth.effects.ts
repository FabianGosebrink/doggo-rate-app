import { LoginResponse } from 'angular-auth-oidc-client';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, concatMap, map, from } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        tap(() => this.authService.login())
      ),
    { dispatch: false }
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      concatMap(({ url }) =>
        this.authService.checkAuth(url).pipe(
          map((response: LoginResponse) =>
            AuthActions.loginComplete({
              isLoggedIn: response.isAuthenticated,
              profile: response.userData,
            })
          )
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      concatMap(() => from(this.router.navigate(['/doggos']))),
      map(() => {
        this.authService.logout();
        return AuthActions.logoutComplete();
      })
    )
  );
}
