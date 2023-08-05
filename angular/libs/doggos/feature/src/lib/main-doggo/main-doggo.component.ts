import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  Doggo,
  DoggosActions,
  getAllDoggosButSelected,
  getLoading,
  getSelectedDoggo,
} from '@ps-doggo-rating/doggos/domain';
import {
  DoggoListComponent,
  DoggoRateComponent,
} from '@ps-doggo-rating/doggos/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-doggo',
  templateUrl: './main-doggo.component.html',
  standalone: true,
  styleUrls: ['./main-doggo.component.css'],
  imports: [AsyncPipe, DoggoListComponent, DoggoRateComponent, NgIf],
})
export class MainDoggoComponent implements OnInit {
  private readonly store = inject(Store);

  doggos$: Observable<Doggo[]>;
  selectedDoggo$: Observable<Doggo | null>;
  loading$: Observable<boolean>;

  ngOnInit(): void {
    this.doggos$ = this.store.pipe(select(getAllDoggosButSelected));
    this.selectedDoggo$ = this.store.pipe(select(getSelectedDoggo));
    this.loading$ = this.store.pipe(select(getLoading));

    this.store.dispatch(DoggosActions.loadDoggos());
    this.store.dispatch(DoggosActions.startRealTimeConnection());
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
