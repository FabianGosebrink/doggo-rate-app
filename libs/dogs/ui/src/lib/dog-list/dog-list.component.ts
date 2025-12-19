import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'lib-dog-list',
  templateUrl: './dog-list.component.html',
  styleUrls: ['./dog-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DogListComponent {
  dogs = input([]);

  dogSelected = output<string>();
}
