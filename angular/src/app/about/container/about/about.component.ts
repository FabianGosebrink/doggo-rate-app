import { Component, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { Observable, from, map } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
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
