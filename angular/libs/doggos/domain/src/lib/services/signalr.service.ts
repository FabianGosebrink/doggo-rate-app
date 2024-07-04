import { inject, Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { environment } from '@ps-doggo-rating/shared/util-environments';
import { RealTimeStore } from '@ps-doggo-rating/shared/util-real-time';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection: HubConnection;

  private readonly store = inject(RealTimeStore);

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
      .then(() => this.store.setRealTimeConnection('On'))
      .catch((err) => console.log(err.toString()));
  }

  stop(): void {
    if (this.connection) {
      this.connection.stop();
      this.store.setRealTimeConnection('Off');
    }
  }

  private registerOnConnectionEvents(): void {
    this.connection.onreconnecting(() =>
      this.store.setRealTimeConnection('Reconnecting')
    );

    this.connection.onreconnected(() => this.store.setRealTimeConnection('On'));

    this.connection.onclose(() => this.store.setRealTimeConnection('Off'));
  }

  private registerOnDoggoEvents(): void {
    // this.connection.on('doggoadded', (doggo) => {
    //   this.store.dispatch(DoggosActions.addDoggoRealtimeFinished({ doggo }));
    // });
    // this.connection.on('doggodeleted', (id) => {
    //   this.store.dispatch(DoggosActions.deleteDoggoRealtimeFinished({ id }));
    // });
    // this.connection.on('doggorated', (doggo) => {
    //   this.store.dispatch(DoggosActions.rateDoggoRealtimeFinished({ doggo }));
    // });
  }
}
