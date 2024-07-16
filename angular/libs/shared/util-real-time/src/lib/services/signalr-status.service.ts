import { Injectable } from '@angular/core';
import { ConnectionStatus } from '../store/realtime.state';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalRStatusService {
  readonly #connectionStatus$ = new BehaviorSubject<ConnectionStatus>(
    'Not Set'
  );
  readonly connectionStatus$ = this.#connectionStatus$.asObservable();

  setStatus(connectionStatus: ConnectionStatus): void {
    this.#connectionStatus$.next(connectionStatus);
  }
}
