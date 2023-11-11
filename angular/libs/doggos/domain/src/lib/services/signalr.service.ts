import { Injectable, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { Store } from '@ngrx/store';
import { environment } from '@ps-doggo-rating/shared/util-environments';
import { RealtimeActions } from '@ps-doggo-rating/shared/util-real-time';
import { DoggosActions } from '../state/doggos.actions';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection: HubConnection;

  private readonly store = inject(Store);

  start(): void {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.server}doggoHub`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.registerOnConnectionEvents();
    this.registerOnDoggoEvents();

    this.connection
      .start()
      .then(() =>
        this.store.dispatch(
          RealtimeActions.setRealTimeConnection({ connection: 'On' })
        )
      )
      .catch((err) => console.log(err.toString()));
  }

  stop(): void {
    if (this.connection) {
      this.connection.stop();
      this.store.dispatch(
        RealtimeActions.setRealTimeConnection({ connection: 'Off' })
      );
    }
  }

  private registerOnConnectionEvents(): void {
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

  private registerOnDoggoEvents(): void {
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
