import { Component, NgZone, OnInit, inject } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { AuthActions } from './auth/store/auth.actions';
import { SignalRService } from './common/real-time/signalr.service';
import { LayoutComponent } from './shell/layout/layout.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.css'],
  imports: [LayoutComponent],
})
export class AppComponent implements OnInit {
  title = 'ratemydoggo';

  private store = inject(Store);
  private signalRService = inject(SignalRService);
  private zone = inject(NgZone);

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
