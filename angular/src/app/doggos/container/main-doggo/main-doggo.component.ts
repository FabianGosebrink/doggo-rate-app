import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Doggo } from '../../models/doggo';
import { DoggoListComponent } from '../../presentational/doggo-list/doggo-list.component';
import { DoggoRateComponent } from '../../presentational/doggo-rate/doggo-rate.component';
import { DoggosActions } from '../../store/doggos.actions';
import {
  getAllDoggosButSelected,
  getLoading,
  getSelectedDoggo,
} from './../../store/doggos.selectors';

@Component({
  selector: 'app-main-doggo',
  templateUrl: './main-doggo.component.html',
  standalone: true,
  styleUrls: ['./main-doggo.component.css'],
  imports: [AsyncPipe, DoggoListComponent, DoggoRateComponent, NgIf],
})
export class MainDoggoComponent implements OnInit {
  doggos$: Observable<Doggo[]>;
  selectedDoggo$: Observable<Doggo | null>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.doggos$ = this.store.pipe(select(getAllDoggosButSelected));
    this.selectedDoggo$ = this.store.pipe(select(getSelectedDoggo));
    this.loading$ = this.store.pipe(select(getLoading));

    this.store.dispatch(DoggosActions.loadDoggos());
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
