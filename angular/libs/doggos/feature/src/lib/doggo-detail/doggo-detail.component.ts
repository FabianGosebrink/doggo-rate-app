import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Doggo,
  DoggosActions,
  getDetailDoggo,
} from '@ps-doggo-rating/doggos/domain';

@Component({
  selector: 'app-doggo-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doggo-detail.component.html',
  styleUrls: ['./doggo-detail.component.scss'],
})
export class DoggoDetailComponent implements OnInit {
  private readonly store = inject(Store);

  private readonly destroyRef = inject(DestroyRef);

  doggo = this.store.selectSignal(getDetailDoggo);

  ngOnInit(): void {
    this.store.dispatch(DoggosActions.loadSingleDoggo());

    this.destroyRef.onDestroy(() => {
      this.store.dispatch(DoggosActions.clearSingleDoggo());
    });
  }

  deleteDoggo(doggo: Doggo): void {
    this.store.dispatch(DoggosActions.deleteDoggo({ doggo }));
  }
}
