import { DatePipe, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Doggo, dogUserEvents } from '@doggo-rating/doggos/domain';
import { DoggoDetailsStore } from './doggo-detail.store';
import { Dispatcher } from '@ngrx/signals/events';

@Component({
  selector: 'app-doggo-detail',
  imports: [RouterLink, NgOptimizedImage, DatePipe, DecimalPipe],
  providers: [DoggoDetailsStore],
  templateUrl: './doggo-detail.component.html',
  styleUrls: ['./doggo-detail.component.scss'],
})
export class DoggoDetailComponent implements OnInit {
  dogId = input('');

  store = inject(DoggoDetailsStore);
  readonly #dispatcher = inject(Dispatcher);

  ngOnInit(): void {
    this.store.loadSingleDoggoIfNotLoaded(this.dogId);
  }

  deleteDoggo(doggo: Doggo): void {
    this.#dispatcher.dispatch(dogUserEvents.deleteDog(doggo));
  }
}
