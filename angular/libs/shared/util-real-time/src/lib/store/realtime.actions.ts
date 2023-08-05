import { createActionGroup, props } from '@ngrx/store';

export const RealtimeActions = createActionGroup({
  source: 'RealTime',
  events: {
    'Set Real Time Connection': props<{ connection: string }>(),
  },
});
