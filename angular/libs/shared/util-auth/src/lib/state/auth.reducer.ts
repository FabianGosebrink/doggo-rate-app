import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap } from 'rxjs';
import { LoginResponse } from 'angular-auth-oidc-client';
import { tapResponse } from '@ngrx/operators';

export const featureName = 'auth';

export interface AuthRootState {
  userProfile: any;
  isLoggedIn: boolean;
}

export const initialState: AuthRootState = {
  userProfile: null,
  isLoggedIn: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthRootState>(initialState),
  withComputed((store) => ({
    userEmail: computed(() => store.userProfile()?.email ?? ''),
  })),
  withMethods(
    (store, authService = inject(AuthService), router = inject(Router)) => ({
      login() {
        authService.login();
      },

      logout() {
        authService.logout();
        patchState(store, initialState);
        router.navigate(['/doggos']);
      },

      checkAuth: rxMethod<string | null>(
        switchMap((url: string | null) => {
          return authService.checkAuth(url).pipe(
            tapResponse({
              next: (response: LoginResponse) =>
                patchState(store, {
                  isLoggedIn: response.isAuthenticated,
                  userProfile: response.userData,
                }),
              error: (err) => console.log(err),
            })
          );
        })
      ),
    })
  )
);
