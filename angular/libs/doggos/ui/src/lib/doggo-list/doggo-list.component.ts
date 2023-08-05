import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Doggo } from '@ps-doggo-rating/doggos/domain';

@Component({
  selector: 'app-doggo-list',
  templateUrl: './doggo-list.component.html',
  styleUrls: ['./doggo-list.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor],
})
export class DoggoListComponent {
  @Input() doggos: Doggo[] | null = [];

  @Output() doggoSelected = new EventEmitter<string>();

  selectDoggo(doggo: Doggo) {
    this.doggoSelected.emit(doggo.id);
  }
}
