import { AsyncPipe, DatePipe, DecimalPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Doggo } from '../../models/doggo';
import { DoggosActions } from '../../store/doggos.actions';
import { getMyDoggos } from './../../store/doggos.selectors';

@Component({
  selector: 'app-my-doggos',
  standalone: true,
  templateUrl: './my-doggos.component.html',
  styleUrls: ['./my-doggos.component.css'],
  imports: [AsyncPipe, RouterLink, DatePipe, DecimalPipe, NgFor],
})
export class MyDoggosComponent implements OnInit {
  doggos$: Observable<Doggo[]>;

  constructor(private store: Store) {
    this.doggos$ = this.store.pipe(select(getMyDoggos));
  }

  ngOnInit(): void {
    this.store.dispatch(DoggosActions.loadMyDoggos());
  }

  deleteDoggo(doggo: Doggo) {
    this.store.dispatch(DoggosActions.deleteDoggo({ doggo }));
  }
}
