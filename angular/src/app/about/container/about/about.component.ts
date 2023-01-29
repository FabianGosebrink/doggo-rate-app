import {
  AsyncPipe,
  JsonPipe,
  KeyValuePipe,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { from, map, Observable } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true,
  styleUrls: ['./about.component.css'],
  imports: [JsonPipe, NgFor, KeyValuePipe, NgIf, AsyncPipe],
})
export class AboutComponent implements OnInit {
  deviceInfo$: Observable<{}>;

  userAgent = window.navigator.userAgent;

  ngOnInit(): void {
    this.deviceInfo$ = from(Device.getInfo()).pipe(
      map((info) => {
        const toReturn = {};
        Object.entries(info).forEach(([key, value]) => {
          toReturn[key] = value;
        });

        return toReturn;
      })
    );
  }
}
