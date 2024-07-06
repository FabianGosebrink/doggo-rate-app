import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DoggosStore } from '@ps-doggo-rating/doggos/domain';
import {
  DoggoListComponent,
  DoggoRateComponent,
} from '@ps-doggo-rating/doggos/ui';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-doggo',
  templateUrl: './main-doggo.component.html',
  standalone: true,
  styleUrls: ['./main-doggo.component.scss'],
  imports: [DoggoListComponent, DoggoRateComponent],
})
export class MainDoggoComponent implements OnInit {
  store = inject(DoggosStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.store.loadDoggos(this.activatedRoute.snapshot.queryParams['doggoId']);
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
