import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoginResponse } from 'angular-auth-oidc-client';
import { concatMap, from, map, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { AuthActions } from './auth.actions';
import { Router } from '@angular/router';

export const login = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(AuthActions.login),
      tap(() => authService.login())
    );
  },
  { functional: true, dispatch: false }
);

export const logout = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    router = inject(Router)
  ) => {
    return actions$.pipe(
      ofType(AuthActions.logout),
      concatMap(() => from(router.navigate(['/doggos']))),
      map(() => {
        authService.logout();

        return AuthActions.logoutComplete();
      })
    );
  },
  { functional: true }
);
export const checkAuth = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(AuthActions.checkAuth),
      concatMap(({ url }) =>
        authService.checkAuth(url).pipe(
          map((response: LoginResponse) =>
            AuthActions.loginComplete({
              isLoggedIn: response.isAuthenticated,
              profile: response.userData,
            })
          )
        )
      )
    );
  },
  { functional: true }
);
