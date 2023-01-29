import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PlatformInformationService } from '../../common/platform-information/platform-information.service';
import { environment } from './../../../environments/environment';
import { selectCurrentUserIdentifier } from './../../auth/store/auth.selectors';
import { getRealTimeConnection } from './../../doggos/store/doggos.selectors';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrls: ['./footer.component.css'],
  imports: [AsyncPipe, NgIf],
})
export class FooterComponent implements OnInit {
  deviceInfo: string;

  userEmail$: Observable<string>;

  backendUrl = environment.server;

  realTimeConnection$: Observable<string>;

  constructor(
    private store: Store,
    private platformInformationService: PlatformInformationService
  ) {
    this.userEmail$ = store.pipe(select(selectCurrentUserIdentifier));
    this.realTimeConnection$ = store.pipe(select(getRealTimeConnection));
  }

  ngOnInit(): void {
    this.deviceInfo = this.platformInformationService.platform;
  }
}
