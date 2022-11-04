import { Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Doggo } from '../../models/doggo';

@Component({
  selector: 'app-doggo-list',
  templateUrl: './doggo-list.component.html',
  styleUrls: ['./doggo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
