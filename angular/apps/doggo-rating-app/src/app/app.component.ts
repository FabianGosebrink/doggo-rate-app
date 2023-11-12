import { Component, NgZone, OnInit, inject } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { AuthActions } from '@ps-doggo-rating/shared/util-auth';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.scss'],
  imports: [LayoutComponent],
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);

  private zone = inject(NgZone);

  title = 'ratemydoggo';

  ngOnInit(): void {
    this.checkAuth(null);

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

  private checkAuth(url: string): void {
    this.store.dispatch(
      AuthActions.checkAuth({
        url,
      })
    );
  }
}
