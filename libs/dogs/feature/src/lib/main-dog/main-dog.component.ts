import { Component, inject, input } from '@angular/core';
import { DogListComponent, DogRateComponent } from '@dog-rating/dogs/ui';
import { MainDogStore } from './main-dog.store';

@Component({
  selector: 'lib-main-dog',
  templateUrl: './main-dog.component.html',
  styleUrls: ['./main-dog.component.scss'],
  providers: [MainDogStore],
  imports: [DogListComponent, DogRateComponent],
})
export class MainDogComponent {
  dogId = input('');
  store = inject(MainDogStore);

  constructor() {
    this.store.selectDog(this.dogId);
  }
}
