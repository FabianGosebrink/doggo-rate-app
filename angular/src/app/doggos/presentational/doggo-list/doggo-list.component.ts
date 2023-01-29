import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Doggo } from '../../models/doggo';

@Component({
  selector: 'app-doggo-list',
  templateUrl: './doggo-list.component.html',
  styleUrls: ['./doggo-list.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor],
})
export class DoggoListComponent implements OnInit {
  @Input() doggos: Doggo[] | null = [];

  @Output() doggoSelected = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  selectDoggo(doggo: Doggo) {
    this.doggoSelected.emit(doggo.id);
  }
}
