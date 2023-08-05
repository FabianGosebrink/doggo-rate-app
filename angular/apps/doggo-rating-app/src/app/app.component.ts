import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '@ps-doggo-rating/shared/util-auth';
import { SignalRService } from '@ps-doggo-rating/shared/util-real-time';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.css'],
  imports: [LayoutComponent],
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);

  private readonly signalRService = inject(SignalRService);

  title = 'ratemydoggo';

  ngOnInit(): void {
    this.checkAuth();

    this.signalRService.start();
  }

  private checkAuth() {
    this.store.dispatch(AuthActions.checkAuth());
  }
}
