import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Device } from '@capacitor/device';

@Component({
  selector: 'ps-doggo-rating-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  deviceInfo = signal<any>(null);

  userAgent = window.navigator.userAgent;

  async ngOnInit(): Promise<void> {
    const deviceInfo = await Device.getInfo();

    this.deviceInfo.set(deviceInfo);
  }
}
