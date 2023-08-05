import { AsyncPipe, DatePipe, DecimalPipe, NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Doggo,
  DoggosActions,
  getMyDoggos,
} from '@ps-doggo-rating/doggos/domain';

@Component({
  selector: 'app-my-doggos',
  standalone: true,
  templateUrl: './my-doggos.component.html',
  styleUrls: ['./my-doggos.component.css'],
  imports: [AsyncPipe, RouterLink, DatePipe, DecimalPipe, NgFor],
})
export class MyDoggosComponent implements OnInit {
  private readonly store = inject(Store);

  doggos = this.store.selectSignal(getMyDoggos);

  ngOnInit(): void {
    this.store.dispatch(DoggosActions.loadMyDoggos());
  }

  deleteDoggo(doggo: Doggo) {
    this.store.dispatch(DoggosActions.deleteDoggo({ doggo }));
  }
}
