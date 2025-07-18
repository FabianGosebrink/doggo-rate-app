import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { environment } from '@doggo-rating/shared/util-environments';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  connection: HubConnection | null = null;

  build(): void {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.server}dogHub`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  start(): Promise<void> {
    return this.connection?.start();
  }

  stop(): Promise<void> {
    return this.connection?.stop();
  }
}
