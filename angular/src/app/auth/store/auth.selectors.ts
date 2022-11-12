import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthRootState, featureName } from './auth.reducer';

export const getAuthFeatureState = createFeatureSelector(featureName);

export const selectCurrentUserProfile = createSelector(
  getAuthFeatureState,
  (state: AuthRootState) =>
    state.userProfile || { nickname: '', email: '', sub: '' }
);

export const selectCurrentUserName = createSelector(
  selectCurrentUserProfile,
  (profile: any) => profile.nickname
);

export const selectCurrentUserIdentifier = createSelector(
  selectCurrentUserProfile,
  (profile: any) => profile.email
);

export const selectIsLoggedIn = createSelector(
  getAuthFeatureState,
  (state: AuthRootState) => state.isLoggedIn
);

export const selectUserSubject = createSelector(
  selectCurrentUserProfile,
  (profile: any) => profile.sub
);
