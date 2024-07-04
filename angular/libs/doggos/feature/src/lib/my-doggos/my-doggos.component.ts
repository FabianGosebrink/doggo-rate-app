import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Doggo, DoggosStore } from '@ps-doggo-rating/doggos/domain';
import { SingleDoggoComponent } from '@ps-doggo-rating/doggos/ui';

@Component({
  selector: 'app-my-doggos',
  standalone: true,
  templateUrl: './my-doggos.component.html',
  styleUrls: ['./my-doggos.component.scss'],
  imports: [SingleDoggoComponent, RouterLink],
})
export class MyDoggosComponent implements OnInit {
  store = inject(DoggosStore);

  ngOnInit(): void {
    this.store.loadMyDoggos();
  }

  deleteDoggo(doggo: Doggo): void {
    this.store.deleteDoggo(doggo);
  }
}
