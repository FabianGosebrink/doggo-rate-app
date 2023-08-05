import { AuthActions } from './auth.actions';
import { createReducer, on } from '@ngrx/store';

export const featureName = 'auth';

export interface AuthRootState {
  userProfile: any;
  isLoggedIn: boolean;
}

export const initialState: AuthRootState = {
  userProfile: null,
  isLoggedIn: false,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.loginComplete, (state, { profile, isLoggedIn }) => {
    return {
      ...state,
      userProfile: profile,
      isLoggedIn,
    };
  }),

  on(AuthActions.logout, (state) => {
    return {
      ...state,
      userProfile: null,
      isLoggedIn: false,
    };
  })
);
