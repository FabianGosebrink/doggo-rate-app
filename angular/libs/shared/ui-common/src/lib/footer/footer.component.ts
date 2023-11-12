import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() userEmail = '';

  @Input() backendUrl = '';

  @Input() realTimeConnection = '';

  @Input() platform = '';
}
