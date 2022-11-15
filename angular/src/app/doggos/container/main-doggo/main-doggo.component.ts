import { SignalRService } from '../../../common/real-time/signalr.service';
import {
  getAllDoggosButSelected,
  getLoading,
  getSelectedDoggo,
} from './../../store/doggos.selectors';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Doggo } from '../../models/doggo';
import { DoggosActions } from '../../store/doggos.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-doggo',
  templateUrl: './main-doggo.component.html',
  styleUrls: ['./main-doggo.component.css'],
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
