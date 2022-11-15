import { Doggo } from '../../doggos/models/doggo';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { DoggosActions } from '../../doggos/store/doggos.actions';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection: HubConnection;
  private itemAddedInternal = new Subject<Doggo>();
  private itemDeletedInternal = new Subject<string>();

  get itemAdded() {
    return this.itemAddedInternal.asObservable();
  }

  get itemDeleted() {
    return this.itemDeletedInternal.asObservable();
  }

  constructor(private store: Store) {}

  start() {
    if (this.connection?.state === HubConnectionState.Connected) {
      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.server}doggoHub`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.onreconnecting(() =>
      this.store.dispatch(
        DoggosActions.setRealTimeConnection({ connection: 'Reconnecting' })
      )
    );

    this.connection.onreconnected(() =>
      this.store.dispatch(
        DoggosActions.setRealTimeConnection({ connection: 'On' })
      )
    );

    this.connection.onclose(() =>
      this.store.dispatch(
        DoggosActions.setRealTimeConnection({ connection: 'Off' })
      )
    );

    this.registerOnEvents();

    this.connection
      .start()
      .then(() =>
        this.store.dispatch(
          DoggosActions.setRealTimeConnection({ connection: 'On' })
        )
      )
      .catch((err) => console.log(err.toString()));
  }

  stop() {
    if (this.connection) {
      this.connection.stop();
      this.store.dispatch(
        DoggosActions.setRealTimeConnection({ connection: 'Off' })
      );
    }
  }

  private registerOnEvents() {
    this.connection.on('DoggoAdded', (doggo) => {
      this.store.dispatch(DoggosActions.addDoggoRealtimeFinished({ doggo }));
    });

    this.connection.on('DoggoDeleted', (id) => {
      this.store.dispatch(DoggosActions.deleteDoggoRealtimeFinished({ id }));
    });
  }
}
