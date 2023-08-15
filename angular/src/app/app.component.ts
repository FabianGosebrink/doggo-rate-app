import { Component, NgZone, OnInit, inject } from '@angular/core';
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
  }

  private checkAuth(url: string) {
    this.store.dispatch(
      AuthActions.checkAuth({
        url,
      })
    );
  }
}
