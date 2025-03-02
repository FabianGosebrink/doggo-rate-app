import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { DoggosStore } from '@doggo-rating/doggos/domain';
import {
  DoggoListComponent,
  DoggoRateComponent,
} from '@doggo-rating/doggos/ui';

@Component({
  selector: 'app-main-doggo',
  templateUrl: './main-doggo.component.html',
  styleUrls: ['./main-doggo.component.scss'],
  imports: [DoggoListComponent, DoggoRateComponent],
})
export class MainDoggoComponent implements OnInit {
  doggoId = input('');
  store = inject(DoggosStore);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.store.loadDoggos(this.doggoId());
    this.store.startListeningToRealtimeDoggoEvents();

    this.destroyRef.onDestroy(() => {
      this.store.stopListeningToRealtimeDoggoEvents();
    });
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
