import { Component, inject, NgZone, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '@dog-rating/shared/util-auth';
import { App as CapApp, URLOpenListenerEvent } from '@capacitor/app';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
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

    CapApp.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        this.checkAuth(event.url);
      });
    });
  }

  private checkAuth(url: string): void {
    this.authStore.checkAuth(url);
  }
}
