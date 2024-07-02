import { JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DoggosStore } from '@ps-doggo-rating/doggos/domain';
import {
  DoggoListComponent,
  DoggoRateComponent,
} from '@ps-doggo-rating/doggos/ui';

@Component({
  selector: 'app-main-doggo',
  templateUrl: './main-doggo.component.html',
  standalone: true,
  styleUrls: ['./main-doggo.component.scss'],
  imports: [DoggoListComponent, DoggoRateComponent, JsonPipe],
})
export class MainDoggoComponent implements OnInit {
  selectedDoggo = signal(null); // this.store.getSelectedDoggo
  private readonly store = inject(DoggosStore);
  doggos = this.store.getAllDoggosButSelected;
  loading = this.store.loading;
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.store.loadDoggos();
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
