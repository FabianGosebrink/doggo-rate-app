import { Component, input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  userEmail = input('');
  backendUrl = input('');
  realTimeConnection = input('');
  platform = input('');

  currentYear = new Date().getFullYear();
}
