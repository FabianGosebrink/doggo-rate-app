import { inject, Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { environment } from '@ps-doggo-rating/shared/util-environments';
import { Subject } from 'rxjs';
import { DoggoEvent } from '../models/doggo';
import { SignalRStatusService } from '@ps-doggo-rating/shared/util-real-time';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  readonly #signalRStatusService = inject(SignalRStatusService);
  #connection: HubConnection;

  readonly #doggoEvents = new Subject<DoggoEvent>();
  readonly doggoEvents = this.#doggoEvents.asObservable();

  start(): void {
    this.#connection = new HubConnectionBuilder()
      .withUrl(`${environment.server}doggoHub`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.registerOnConnectionEvents();
    this.registerOnDoggoEvents();

    this.#connection
      .start()
      .then(() => this.#signalRStatusService.setStatus('On'))
      .catch((err) => console.log(err.toString()));
  }

  stop(): void {
    if (this.#connection) {
      this.#connection.stop();
      this.#signalRStatusService.setStatus('Off');
    }
  }

  private registerOnConnectionEvents(): void {
    this.#connection.onreconnecting(() =>
      this.#signalRStatusService.setStatus('Reconnecting')
    );

    this.#connection.onreconnected(() =>
      this.#signalRStatusService.setStatus('On')
    );

    this.#connection.onclose(() => this.#signalRStatusService.setStatus('Off'));
  }

  private registerOnDoggoEvents(): void {
    this.#connection.on('doggoadded', (doggo) => {
      this.#doggoEvents.next({ type: 'doggoadded', doggo });
    });
    this.#connection.on('doggodeleted', (id) => {
      this.#doggoEvents.next({ type: 'doggodeleted', id });
    });
    this.#connection.on('doggorated', (doggo) => {
      this.#doggoEvents.next({ type: 'doggorated', doggo });
    });
  }
}
