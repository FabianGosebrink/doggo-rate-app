import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Doggo, DoggosStore } from '@ps-doggo-rating/doggos/domain';

@Component({
  selector: 'app-doggo-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './doggo-detail.component.html',
  styleUrls: ['./doggo-detail.component.scss'],
})
export class DoggoDetailComponent implements OnInit {
  doggoId = input('');

  store = inject(DoggosStore);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.store.loadSingleDoggo(this.doggoId());

    this.destroyRef.onDestroy(() => {
      this.store.clearSingleDoggo();
    });
  }

  deleteDoggo(doggo: Doggo): void {
    this.store.deleteDoggo(doggo);
  }
}
