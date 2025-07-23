import { Component, inject, input, OnInit } from '@angular/core';
import { DogListComponent, DogRateComponent } from '@dog-rating/dogs/ui';
import { MainDogsStore } from './main-dog.store';

@Component({
  selector: 'app-main-dog',
  templateUrl: './main-dog.component.html',
  styleUrls: ['./main-dog.component.scss'],
  providers: [MainDogsStore],
  imports: [DogListComponent, DogRateComponent],
})
export class MainDogComponent implements OnInit {
  dogId = input('');
  store = inject(MainDogsStore);

  ngOnInit(): void {
    this.store.selectDog(this.dogId);
  }

  rateDog(rating: number): void {
    this.store.rateDog(rating);
  }

  skipDog(): void {
    this.store.selectNextDog();
  }

  selectDog(id: string): void {
    this.store.selectDog(id);
  }
}
