import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Doggo, dogUserEvents } from '@doggo-rating/doggos/domain';
import { SingleDoggoComponent } from '@doggo-rating/doggos/ui';
import { MyDoggosStore } from './my-doggos.store';
import { Dispatcher } from '@ngrx/signals/events';

@Component({
  selector: 'app-my-doggos',
  templateUrl: './my-doggos.component.html',
  styleUrls: ['./my-doggos.component.scss'],
  imports: [SingleDoggoComponent, RouterLink],
  providers: [MyDoggosStore],
})
export class MyDoggosComponent {
  store = inject(MyDoggosStore);
  readonly #dispatcher = inject(Dispatcher);

  deleteDoggo(doggo: Doggo): void {
    this.#dispatcher.dispatch(dogUserEvents.deleteDog(doggo));
  }
}
