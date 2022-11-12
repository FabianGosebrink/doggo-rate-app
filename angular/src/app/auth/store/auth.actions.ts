import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Complete': props<{ profile: any; isLoggedIn: boolean }>(),
    Logout: emptyProps(),
    'Logout Complete': emptyProps(),
  },
});
