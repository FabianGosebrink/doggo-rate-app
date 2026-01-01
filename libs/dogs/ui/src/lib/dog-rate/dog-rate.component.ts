import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { timer } from 'rxjs';
import { Dog } from '@dog-rating/dogs/domain';

@Component({
  selector: 'lib-dog-rate',
  templateUrl: './dog-rate.component.html',
  styleUrls: ['./dog-rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
})
export class DogRateComponent {
  currentDog = input<Dog | null>(null);
  rated = output<number>();
  skipped = output();
  currentRating = 0;
  averageRating = computed(() => {
    this.currentRating = 0;

    return this.getAverageRating(this.currentDog());
  });
  status: 'fadeIn' | 'fadeOut' = 'fadeIn';

  rateDog(rating: number): void {
    this.currentRating = rating;
    this.status = 'fadeOut';

    timer(1000).subscribe(() => {
      this.rated.emit(rating);
    });
  }

  private getAverageRating(currentDog: Dog | null): number {
    if (!currentDog) {
      return 0;
    }

    const { ratingCount, ratingSum } = currentDog;

    return ratingSum / ratingCount;
  }
}
