import { Component, OnInit } from '@angular/core';
import { Device, DeviceInfo } from '@capacitor/device';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  deviceInfo$: Observable<DeviceInfo>;

  constructor() {}

  ngOnInit(): void {
    this.deviceInfo$ = from(Device.getInfo());
  }
}
