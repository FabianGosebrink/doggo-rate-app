import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Dog } from '@dog-rating/dogs/domain';

@Component({
  selector: 'app-dog-list',
  templateUrl: './dog-list.component.html',
  styleUrls: ['./dog-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DogListComponent {
  dogs = input([]);

  dogSelected = output<string>();

  selectDog(dog: Dog): void {
    this.dogSelected.emit(dog.id);
  }
}
