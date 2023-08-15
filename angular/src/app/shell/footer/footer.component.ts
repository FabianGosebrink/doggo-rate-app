import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { getRealTimeConnection } from '../../common/real-time/store/realtime.selectors';
import { environment } from './../../../environments/environment';
import { selectCurrentUserIdentifier } from './../../auth/store/auth.selectors';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrls: ['./footer.component.css'],
  imports: [NgIf],
})
export class FooterComponent {
  private readonly store = inject(Store);

  userEmail = this.store.selectSignal(selectCurrentUserIdentifier);

  backendUrl = environment.server;

  realTimeConnection = this.store.selectSignal(getRealTimeConnection);
}
