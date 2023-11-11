import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Device, DeviceInfo } from '@capacitor/device';

@Component({
  selector: 'ps-doggo-rating-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  deviceInfo = signal<DeviceInfo | null>(null);

  userAgent = window.navigator.userAgent;

  async ngOnInit(): Promise<void> {
    const deviceInfo = await Device.getInfo();

    this.deviceInfo.set(deviceInfo);
  }
}
