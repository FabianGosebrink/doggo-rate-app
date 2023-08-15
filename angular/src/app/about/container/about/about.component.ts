import { JsonPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true,
  styleUrls: ['./about.component.css'],
  imports: [JsonPipe, NgFor, KeyValuePipe, NgIf],
})
export class AboutComponent implements OnInit {
  deviceInfo = signal<any>({});

  userAgent = window.navigator.userAgent;

  async ngOnInit(): Promise<void> {
    this.deviceInfo.set(this.userAgent);
  }
}
