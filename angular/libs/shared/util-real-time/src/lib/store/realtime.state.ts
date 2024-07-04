import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type ConnectionStatus = 'On' | 'Off' | 'Reconnecting' | 'Not Set';

export interface RealTimeState {
  realTimeConnection: ConnectionStatus;
}

export const initialState: RealTimeState = {
  realTimeConnection: 'Not Set',
};

export const RealTimeStore = signalStore(
  { providedIn: 'root' },
  withState<RealTimeState>(initialState),
  withMethods((store) => ({
    setRealTimeConnection(realTimeConnection: ConnectionStatus) {
      patchState(store, { realTimeConnection });
    },
  }))
);
