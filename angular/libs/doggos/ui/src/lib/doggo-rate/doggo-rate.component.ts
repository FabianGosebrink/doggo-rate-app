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
import { Doggo } from '@ps-doggo-rating/doggos/domain';
import { timer } from 'rxjs';

@Component({
  selector: 'app-doggo-rate',
  templateUrl: './doggo-rate.component.html',
  styleUrls: ['./doggo-rate.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition('* => fadeIn', [animate(1000, style({ opacity: 1 }))]),
      transition('* => fadeOut', [animate(1200, style({ opacity: 0 }))]),
    ]),
  ],
  imports: [DecimalPipe, NgClass, NgIf],
})
export class DoggoRateComponent implements OnChanges {
  @Input() currentDoggo: Doggo | null = null;
  @Output() rated = new EventEmitter<number>();
  @Output() skipped = new EventEmitter();

  averageRating = 0;

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

    timer(1000).subscribe(() => {
      this.rated.emit(rating);
    });
  }

  skipDoggo() {
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
