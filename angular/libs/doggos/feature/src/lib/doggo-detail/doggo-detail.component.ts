import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Doggo, DoggosStore } from '@ps-doggo-rating/doggos/domain';

@Component({
  selector: 'app-doggo-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doggo-detail.component.html',
  styleUrls: ['./doggo-detail.component.scss'],
})
export class DoggoDetailComponent implements OnInit {
  doggo = signal(null); // this.store.selectSignal(getDetailDoggo);
  private readonly store = inject(DoggosStore);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // this.store.dispatch(DoggosActions.loadSingleDoggo());
    //
    // this.destroyRef.onDestroy(() => {
    //   this.store.dispatch(DoggosActions.clearSingleDoggo());
    // });
  }

  deleteDoggo(doggo: Doggo): void {
    //this.store.dispatch(DoggosActions.deleteDoggo({ doggo }));
  }
}
