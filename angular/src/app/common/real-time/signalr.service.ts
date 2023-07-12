import { Injectable, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { DoggosActions } from '../../doggos/store/doggos.actions';
import { RealtimeActions } from './store/realtime.actions';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection: HubConnection;

  private readonly store = inject(Store);

  start() {
    if (this.connection?.state === HubConnectionState.Connected) {
      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.server}doggoHub`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.registerOnConnectionEvents();
    this.registerOnServerEvents();

    this.connection
      .start()
      .then(() =>
        this.store.dispatch(
          RealtimeActions.setRealTimeConnection({ connection: 'On' })
        )
      )
      .catch((err) => console.log(err.toString()));
  }

  stop() {
    if (this.connection) {
      this.connection.stop();
      this.store.dispatch(
        RealtimeActions.setRealTimeConnection({ connection: 'Off' })
      );
    }
  }

  private registerOnConnectionEvents() {
    this.connection.onreconnecting(() =>
      this.store.dispatch(
        RealtimeActions.setRealTimeConnection({ connection: 'Reconnecting' })
      )
    );

    this.connection.onreconnected(() =>
      this.store.dispatch(
        RealtimeActions.setRealTimeConnection({ connection: 'On' })
      )
    );

    this.connection.onclose(() =>
      this.store.dispatch(
        RealtimeActions.setRealTimeConnection({ connection: 'Off' })
      )
    );
  }

  private registerOnServerEvents() {
    this.connection.on('doggoadded', (doggo) => {
      this.store.dispatch(DoggosActions.addDoggoRealtimeFinished({ doggo }));
    });

    this.connection.on('doggodeleted', (id) => {
      this.store.dispatch(DoggosActions.deleteDoggoRealtimeFinished({ id }));
    });

    this.connection.on('doggorated', (doggo) => {
      this.store.dispatch(DoggosActions.rateDoggoRealtimeFinished({ doggo }));
    });
  }
}
