import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { filter } from 'rxjs';
import { Dog } from '@dog-rating/dogs/domain';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-dog-rate',
  templateUrl: './dog-rate.component.html',
  styleUrls: ['./dog-rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
})
export class DogRateComponent {
  currentDog = input<Dog | null>(null);
  currentRating = signal(0);

  rated = outputFromObservable(
    toObservable(this.currentRating).pipe(filter((rating) => rating > 0)),
  );

  skipped = output();
  averageRating = computed(() => this.getAverageRating(this.currentDog()));

  rateDog(rating: number): void {
    this.currentRating.set(0);
    this.currentRating.set(rating);
  }

  private getAverageRating(currentDog: Dog | null): number {
    if (!currentDog) {
      return 0;
    }

    const { ratingCount, ratingSum } = currentDog;

    return ratingSum / ratingCount;
  }
}
