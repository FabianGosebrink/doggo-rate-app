import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrls: ['./footer.component.css'],
  imports: [AsyncPipe, NgIf],
})
export class FooterComponent {
  @Input() userEmail = '';
  @Input() backendUrl = '';
}
