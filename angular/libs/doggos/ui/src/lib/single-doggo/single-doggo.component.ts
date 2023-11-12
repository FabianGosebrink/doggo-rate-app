import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Doggo } from '@ps-doggo-rating/doggos/domain';

@Component({
  selector: 'app-single-doggo',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './single-doggo.component.html',
  styleUrls: ['./single-doggo.component.scss'],
})
export class SingleDoggoComponent {
  private readonly router = inject(Router);

  @Input() doggo: Doggo | null = null;

  @Output() doggoDeleted = new EventEmitter<Doggo>();

  deleteDoggo(doggo: Doggo): void {
    this.doggoDeleted.emit(doggo);
  }

  navigateToDoggo(): void {
    this.router.navigate(['doggos/details', this.doggo?.id]);
  }
}
