import { getAllDoggos } from './../../store/doggos.selectors';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Doggo } from '../../models/doggo';
import { DoggosActions } from '../../store/doggos.actions';

@Component({
  selector: 'app-my-doggos',
  templateUrl: './my-doggos.component.html',
  styleUrls: ['./my-doggos.component.css'],
})
export class MyDoggosComponent implements OnInit {
  doggos$: Observable<Doggo[]>;

  constructor(private store: Store) {
    this.doggos$ = this.store.pipe(select(getAllDoggos));
  }

  ngOnInit(): void {
    this.store.dispatch(DoggosActions.loadDoggos());
  }

  deleteDoggo(doggo: Doggo) {
    this.store.dispatch(DoggosActions.deleteDoggo({ doggo }));
  }
}
