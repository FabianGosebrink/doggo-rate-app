import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dog, dogUserEvents } from '@dog-rating/dogs/domain';
import { SingleDogComponent } from '@dog-rating/dogs/ui';
import { MyDogsStore } from './my-dogs.store';
import { Dispatcher } from '@ngrx/signals/events';

@Component({
  selector: 'app-my-doggos',
  templateUrl: './my-dogs.component.html',
  styleUrls: ['./my-dogs.component.scss'],
  imports: [SingleDogComponent, RouterLink],
  providers: [MyDogsStore],
})
export class MyDogsComponent {
  store = inject(MyDogsStore);
  readonly #dispatcher = inject(Dispatcher);

  deleteDog(dog: Dog): void {
    this.#dispatcher.dispatch(dogUserEvents.deleteDog(dog));
  }
}
