import { inject, Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { environment } from '@ps-doggo-rating/shared/util-environments';
import { RealTimeStore } from '@ps-doggo-rating/shared/util-real-time';
import { DoggosStore } from '../state/doggos-signal.state';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection: HubConnection;

  private readonly realTimeStore = inject(RealTimeStore);
  private readonly doggosStore = inject(DoggosStore);

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
      .then(() => this.realTimeStore.setRealTimeConnection('On'))
      .catch((err) => console.log(err.toString()));
  }

  stop(): void {
    if (this.connection) {
      this.connection.stop();
      this.realTimeStore.setRealTimeConnection('Off');
    }
  }

  private registerOnConnectionEvents(): void {
    this.connection.onreconnecting(() =>
      this.realTimeStore.setRealTimeConnection('Reconnecting')
    );

    this.connection.onreconnected(() =>
      this.realTimeStore.setRealTimeConnection('On')
    );

    this.connection.onclose(() =>
      this.realTimeStore.setRealTimeConnection('Off')
    );
  }

  private registerOnDoggoEvents(): void {
    this.connection.on('doggoadded', (doggo) => {
      this.doggosStore.addDoggoFromRealTime(doggo);
    });
    this.connection.on('doggodeleted', (id) => {
      this.doggosStore.deleteDoggoFromRealTime(id);
    });
    this.connection.on('doggorated', (doggo) => {
      this.doggosStore.rateDoggoFromRealTime(doggo);
    });
  }
}
