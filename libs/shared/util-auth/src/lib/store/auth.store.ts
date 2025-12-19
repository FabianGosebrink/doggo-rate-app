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
import { exhaustMap } from 'rxjs';
import { LoginResponse } from 'angular-auth-oidc-client';
import { tapResponse } from '@ngrx/operators';
import { UserProfile } from '../models/user-profile';

export interface AuthRootState {
  userProfile: UserProfile | null;
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
    userSub: computed(() => store.userProfile()?.sub ?? ''),
  })),
  withMethods(
    (store, authService = inject(AuthService), router = inject(Router)) => ({
      login() {
        authService.login();
      },

      logout() {
        authService.logout();
        patchState(store, initialState);
        router.navigate(['/dogs']);
      },

      checkAuth: rxMethod<string | null>(
        exhaustMap((url: string | null) => {
          return authService.checkAuth(url).pipe(
            tapResponse({
              next: (response: LoginResponse) =>
                patchState(store, {
                  isLoggedIn: response.isAuthenticated,
                  userProfile: response.userData,
                }),
              error: (err) => console.log(err),
            }),
          );
        }),
      ),
    }),
  ),
);
