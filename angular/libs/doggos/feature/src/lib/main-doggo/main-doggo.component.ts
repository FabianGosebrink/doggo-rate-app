import { AsyncPipe, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DoggosActions,
  getAllDoggosButSelected,
  getLoading,
  getSelectedDoggo,
} from '@ps-doggo-rating/doggos/domain';
import {
  DoggoListComponent,
  DoggoRateComponent,
} from '@ps-doggo-rating/doggos/ui';

@Component({
  selector: 'app-main-doggo',
  templateUrl: './main-doggo.component.html',
  standalone: true,
  styleUrls: ['./main-doggo.component.css'],
  imports: [AsyncPipe, DoggoListComponent, DoggoRateComponent, NgIf],
})
export class MainDoggoComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  doggos = this.store.selectSignal(getAllDoggosButSelected);
  selectedDoggo = this.store.selectSignal(getSelectedDoggo);
  loading = this.store.selectSignal(getLoading);

  ngOnInit(): void {
    this.store.dispatch(DoggosActions.loadDoggos());
    this.store.dispatch(DoggosActions.startListeningToRealtimeDoggoEvents());

    this.destroyRef.onDestroy(() => {
      this.store.dispatch(DoggosActions.stopListeningToRealtimeDoggoEvents());
    });
  }

  rateDoggo(rating: number) {
    this.store.dispatch(DoggosActions.rateDoggo({ rating }));
  }

  skipDoggo() {
    this.store.dispatch(DoggosActions.selectNextDoggo());
  }

  selectDoggo(id: string) {
    this.store.dispatch(DoggosActions.selectDoggo({ id }));
  }
}