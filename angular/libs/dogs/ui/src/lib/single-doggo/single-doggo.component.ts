import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Doggo } from '@doggo-rating/doggos/domain';

@Component({
  selector: 'app-single-doggo',
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './single-doggo.component.html',
  styleUrls: ['./single-doggo.component.scss'],
})
export class SingleDoggoComponent {
  doggo = input<Doggo | null>();

  @Output() doggoDeleted = new EventEmitter<Doggo>();

  deleteDoggo(doggo: Doggo): void {
    this.doggoDeleted.emit(doggo);
  }
}
