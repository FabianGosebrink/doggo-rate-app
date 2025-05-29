import { Component, inject, OnInit } from '@angular/core';
import {
  DoggoListComponent,
  DoggoRateComponent,
} from '@doggo-rating/doggos/ui';
import { MainDoggosStore } from './main-doggo.store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-doggo',
  templateUrl: './main-doggo.component.html',
  styleUrls: ['./main-doggo.component.scss'],
  providers: [MainDoggosStore],
  imports: [DoggoListComponent, DoggoRateComponent],
})
export class MainDoggoComponent implements OnInit {
  store = inject(MainDoggosStore);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.store.selectDoggo(this.activatedRoute.snapshot.queryParams['doggoId']);
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
