import { Component, inject, NgZone, OnInit } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { AuthStore } from '@doggo-rating/shared/util-auth';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
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
