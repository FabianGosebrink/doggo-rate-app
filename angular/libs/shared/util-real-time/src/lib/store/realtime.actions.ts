import { createActionGroup, props } from '@ngrx/store';
import { ConnectionStatus } from './realtime.selectors';

export const RealtimeActions = createActionGroup({
  source: 'RealTime',
  events: {
    'Set Real Time Connection': props<{ connection: ConnectionStatus }>(),
  },
});
