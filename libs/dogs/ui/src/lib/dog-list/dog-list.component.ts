import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'lib-dog-list',
  templateUrl: './dog-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DogListComponent {
  dogs = input([]);

  dogSelected = output<string>();
}
