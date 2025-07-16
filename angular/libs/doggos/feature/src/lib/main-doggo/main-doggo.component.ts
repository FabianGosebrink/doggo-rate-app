import { Component, inject, input, OnInit } from '@angular/core';
import {
  DoggoListComponent,
  DoggoRateComponent,
} from '@doggo-rating/doggos/ui';
import { MainDoggosStore } from './main-doggo.store';

@Component({
  selector: 'app-main-doggo',
  templateUrl: './main-doggo.component.html',
  styleUrls: ['./main-doggo.component.scss'],
  providers: [MainDoggosStore],
  imports: [DoggoListComponent, DoggoRateComponent],
})
export class MainDoggoComponent implements OnInit {
  dogId = input('');
  store = inject(MainDoggosStore);

  ngOnInit(): void {
    this.store.selectDoggo(this.dogId);
  }

  rateDoggo(rating: number): void {
    this.store.rateDoggo(rating);
  }

  skipDoggo(): void {
    this.store.selectNextDoggo();
  }

  selectDoggo(id: string): void {
    this.store.selectDoggo(id);
  }
}
