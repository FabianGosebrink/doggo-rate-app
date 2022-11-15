import { PlatformInformationService } from '../../common/platform-information/platform-information.service';
import { getRealTimeConnection } from './../../doggos/store/doggos.selectors';
import { environment } from './../../../environments/environment';
import { selectCurrentUserIdentifier } from './../../auth/store/auth.selectors';
import { Component, OnInit } from '@angular/core';
import { Device, DeviceInfo } from '@capacitor/device';
import { Store, select } from '@ngrx/store';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
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
