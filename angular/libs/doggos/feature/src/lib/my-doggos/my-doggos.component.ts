import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Doggo,
  DoggosActions,
  getMyDoggos,
} from '@ps-doggo-rating/doggos/domain';
import { SingleDoggoComponent } from '@ps-doggo-rating/doggos/ui';

@Component({
  selector: 'app-my-doggos',
  standalone: true,
  templateUrl: './my-doggos.component.html',
  styleUrls: ['./my-doggos.component.scss'],
  imports: [SingleDoggoComponent, RouterLink],
})
export class MyDoggosComponent implements OnInit {
  private readonly store = inject(Store);

  doggos = this.store.selectSignal(getMyDoggos);

  ngOnInit(): void {
    this.store.dispatch(DoggosActions.loadMyDoggos());
  }

  deleteDoggo(doggo: Doggo): void {
    this.store.dispatch(DoggosActions.deleteDoggo({ doggo }));
  }
}
