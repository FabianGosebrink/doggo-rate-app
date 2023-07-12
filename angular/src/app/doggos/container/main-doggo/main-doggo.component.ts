import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
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
  imports: [DoggoListComponent, DoggoRateComponent, NgIf],
})
export class MainDoggoComponent implements OnInit {
  private readonly store = inject(Store);

  doggos = this.store.selectSignal(getAllDoggosButSelected);
  selectedDoggo = this.store.selectSignal(getSelectedDoggo);
  loading = this.store.selectSignal(getLoading);

  ngOnInit(): void {
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
