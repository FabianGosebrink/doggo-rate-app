import {
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { timer } from 'rxjs';
import { Doggo } from '../../models/doggo';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-doggo-rate',
  templateUrl: './doggo-rate.component.html',
  styleUrls: ['./doggo-rate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition('* => fadeIn', [animate(1000, style({ opacity: 1 }))]),
      transition('* => fadeOut', [animate(1200, style({ opacity: 0 }))]),
    ]),
  ],
})
export class DoggoRateComponent implements OnInit, OnChanges {
  @Input() currentDoggo: Doggo | null = null;
  @Output() rated = new EventEmitter<number>();
  @Output() skipped = new EventEmitter();

  averageRating: number;

  status: 'fadeIn' | 'fadeOut' = 'fadeIn';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDoggo'].currentValue) {
      this.averageRating = this.getAverageRating(this.currentDoggo);
      this.status = 'fadeIn';
    }
  }

  ngOnInit(): void {}

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

  private getAverageRating(currentDoggo: Doggo): number {
    const { ratingCount, ratingSum } = currentDoggo;

    return ratingSum / ratingCount;
  }
}
