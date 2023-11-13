import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Doggo } from '@ps-doggo-rating/doggos/domain';

@Component({
  selector: 'app-single-doggo',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './single-doggo.component.html',
  styleUrls: ['./single-doggo.component.scss'],
})
export class SingleDoggoComponent {
  @Input() doggo: Doggo | null = null;

  @Output() doggoDeleted = new EventEmitter<Doggo>();

  deleteDoggo(doggo: Doggo): void {
    this.doggoDeleted.emit(doggo);
  }
}
