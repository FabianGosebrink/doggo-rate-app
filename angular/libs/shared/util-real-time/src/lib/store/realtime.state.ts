import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tap } from 'rxjs';
import { inject } from '@angular/core';
import { SignalRStatusService } from '../services/signalr-status.service';

export type ConnectionStatus = 'On' | 'Off' | 'Reconnecting' | 'Not Set';

export interface RealTimeState {
  connectionStatus: ConnectionStatus;
}

export const initialState: RealTimeState = {
  connectionStatus: 'Not Set',
};

export const RealTimeStore = signalStore(
  { providedIn: 'root' },
  withState<RealTimeState>(initialState),
  withMethods((store) => ({
    setConnectionStatus: rxMethod<ConnectionStatus>(
      tap((connectionStatus: ConnectionStatus) =>
        patchState(store, { connectionStatus })
      )
    ),
  })),
  withHooks({
    onInit(
      { setConnectionStatus },
      signalRStatusService = inject(SignalRStatusService)
    ) {
      setConnectionStatus(signalRStatusService.connectionStatus$);
    },
  })
);
