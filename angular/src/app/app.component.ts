import { Component, NgZone, OnInit } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { AuthActions } from './auth/store/auth.actions';
import { SignalRService } from './common/real-time/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ratemydoggo';

  constructor(
    private store: Store,
    private zone: NgZone,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.checkAuth(null);

    this.signalRService.start();

    if ((window as any).electronAPI) {
      (window as any).electronAPI.authEvent((event, value) => {
        console.log('Received Auth Event', value);
        this.zone.run(() => {
          this.checkAuth(value);
        });
      });
    }

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        this.checkAuth(event.url);
      });
    });
  }

  private checkAuth(url: string) {
    this.store.dispatch(
      AuthActions.checkAuth({
        url,
      })
    );
  }
}
