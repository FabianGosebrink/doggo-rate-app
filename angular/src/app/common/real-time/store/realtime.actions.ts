import { createActionGroup, props } from '@ngrx/store';

export const RealtimeActions = createActionGroup({
  source: 'Auth',
  events: {
    'Set Real Time Connection': props<{ connection: string }>(),
  },
});
