import { JsonPipe, KeyValuePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component } from '@angular/core';
import { from } from 'rxjs';
import { Device } from '@capacitor/device';

@Component({
  selector: 'lib-dog-rating-about',
  imports: [KeyValuePipe, JsonPipe],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  deviceInfo = toSignal(from(Device.getInfo()), { initialValue: null });

  userAgent = window.navigator.userAgent;
}
