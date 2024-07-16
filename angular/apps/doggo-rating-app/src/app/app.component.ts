import { Component, inject, NgZone, OnInit } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { LayoutComponent } from './layout/layout.component';
import { AuthStore } from '@ps-doggo-rating/shared/util-auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.scss'],
  imports: [LayoutComponent],
})
export class AppComponent implements OnInit {
  title = 'ratemydoggo';
  private readonly authStore = inject(AuthStore);
  private zone = inject(NgZone);

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
    this.authStore.checkAuth(url);
  }
}
