import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { HubConnectionState } from '@microsoft/signalr';

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
  withProps((_, signalRService = inject(SignalRService)) => ({
    connection: signalRService.connection,
  })),
  withMethods((store, signalRService = inject(SignalRService)) => ({
    _onReconnected() {
      patchState(store, { connectionStatus: 'On' });
    },
    _onReconnecting() {
      patchState(store, { connectionStatus: 'Reconnecting' });
    },
    _onClose() {
      patchState(store, { connectionStatus: 'Off' });
    },
    async startConnection() {
      if (signalRService.connection?.state !== HubConnectionState.Connected) {
        await signalRService.start();
      }
      patchState(store, { connectionStatus: 'On' });
    },
    async stopConnection() {
      await signalRService.stop();
      patchState(store, { connectionStatus: 'Off' });
    },
  })),
  withHooks({
    onInit(
      { _onReconnected, _onReconnecting, _onClose },
      signalRService = inject(SignalRService),
    ) {
      signalRService.build();

      signalRService.connection?.onreconnected(() => _onReconnected());
      signalRService.connection?.onreconnecting(() => _onReconnecting());
      signalRService.connection?.onclose(() => _onClose());
    },
  }),
);
