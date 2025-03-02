import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Doggo } from '@doggo-rating/doggos/domain';

@Component({
  selector: 'app-doggo-list',
  templateUrl: './doggo-list.component.html',
  styleUrls: ['./doggo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoggoListComponent {
  doggos = input([]);

  doggoSelected = output<string>();

  selectDoggo(doggo: Doggo): void {
    this.doggoSelected.emit(doggo.id);
  }
}
