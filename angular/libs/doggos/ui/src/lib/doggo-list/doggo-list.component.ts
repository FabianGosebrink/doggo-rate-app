import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { Doggo } from '@ps-doggo-rating/doggos/domain';

@Component({
  selector: 'app-doggo-list',
  templateUrl: './doggo-list.component.html',
  styleUrls: ['./doggo-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoggoListComponent {
  doggos = input([]);

  @Output() doggoSelected = new EventEmitter<string>();

  selectDoggo(doggo: Doggo): void {
    this.doggoSelected.emit(doggo.id);
  }
}
