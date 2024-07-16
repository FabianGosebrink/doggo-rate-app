import { animate, style, transition, trigger } from '@angular/animations';
import { DecimalPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { Doggo } from '@ps-doggo-rating/doggos/domain';
import { timer } from 'rxjs';

@Component({
  selector: 'app-doggo-rate',
  templateUrl: './doggo-rate.component.html',
  styleUrls: ['./doggo-rate.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition('* => fadeIn', [animate(1000, style({ opacity: 1 }))]),
      transition('* => fadeOut', [animate(1200, style({ opacity: 0 }))]),
    ]),
  ],
  imports: [DecimalPipe, NgClass],
})
export class DoggoRateComponent {
  currentDoggo = input<Doggo | null>(null);
  @Output() rated = new EventEmitter<number>();
  @Output() skipped = new EventEmitter();
  currentRating = 0;
  averageRating = computed(() => {
    this.currentRating = 0;

    return this.getAverageRating(this.currentDoggo());
  });
  status: 'fadeIn' | 'fadeOut' = 'fadeIn';

  rateDoggo(rating: number): void {
    this.currentRating = rating;
    this.status = 'fadeOut';

    timer(1000).subscribe(() => {
      this.rated.emit(rating);
    });
  }

  skipDoggo(): void {
    this.skipped.emit();
  }

  private getAverageRating(currentDoggo: Doggo | null): number {
    if (!currentDoggo) {
      return 0;
    }

    const { ratingCount, ratingSum } = currentDoggo;

    return ratingSum / ratingCount;
  }
}
