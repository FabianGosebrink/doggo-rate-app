import { DatePipe, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dog, dogUserEvents } from '@dog-rating/dogs/domain';
import { DogDetailsStore } from './dog-detail.store';
import { Dispatcher } from '@ngrx/signals/events';

@Component({
  selector: 'lib-dog-detail',
  imports: [RouterLink, NgOptimizedImage, DatePipe, DecimalPipe],
  providers: [DogDetailsStore],
  templateUrl: './dog-detail.component.html',
  styleUrls: ['./dog-detail.component.scss'],
})
export class DogDetailComponent {
  dogId = input('');

  store = inject(DogDetailsStore);
  readonly #dispatcher = inject(Dispatcher);

  constructor() {
    this.store.loadSingleDogIfNotLoaded(this.dogId);
  }

  deleteDog(dog: Dog): void {
    this.#dispatcher.dispatch(dogUserEvents.deleteDog(dog));
  }
}
