import { animate, style, transition, trigger } from '@angular/animations';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { timer } from 'rxjs';
import { Doggo } from '../../models/doggo';

const ANIMATION_DURATION = 1000;

@Component({
  selector: 'app-doggo-rate',
  templateUrl: './doggo-rate.component.html',
  styleUrls: ['./doggo-rate.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition('* => fadeIn', [
        animate(ANIMATION_DURATION, style({ opacity: 1 })),
      ]),
      transition('* => fadeOut', [animate(1200, style({ opacity: 0 }))]),
    ]),
  ],
  imports: [DecimalPipe, NgClass, NgIf],
})
export class DoggoRateComponent implements OnChanges {
  @Input() currentDoggo: Doggo | null = null;
  @Output() rated = new EventEmitter<number>();
  @Output() skipped = new EventEmitter();

  averageRating: number;

  status: 'fadeIn' | 'fadeOut' = 'fadeIn';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDoggo'].currentValue) {
      this.averageRating = this.getAverageRating(this.currentDoggo);
      this.status = 'fadeIn';
    }
  }

  rateDoggo(rating: number) {
    this.averageRating = rating;
    this.status = 'fadeOut';

    timer(ANIMATION_DURATION).subscribe(() => {
      this.rated.emit(rating);
    });
  }

  skipDoggo() {
    this.skipped.emit();
  }

  private getAverageRating(currentDoggo: Doggo): number {
    const { ratingCount, ratingSum } = currentDoggo;

    return ratingSum / ratingCount;
  }
}
