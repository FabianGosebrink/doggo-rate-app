import { createReducer, on } from '@ngrx/store';
import { RealtimeActions } from './realtime.actions';
import { RealTimeState, initialState } from './realtime.state';

export const realtimeReducer = createReducer<RealTimeState>(
  initialState,

  on(RealtimeActions.setRealTimeConnection, (state, { connection }) => {
    return {
      ...state,
      realTimeConnection: connection,
    };
  })
);
