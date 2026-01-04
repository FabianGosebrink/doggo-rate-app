import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogRateComponent } from './dog-rate.component';
import { Dog } from '@dog-rating/dogs/domain';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentRef } from '@angular/core';

describe('DogRateComponent', () => {
  let component: DogRateComponent;
  let fixture: ComponentFixture<DogRateComponent>;
  let componentRef: ComponentRef<DogRateComponent>;

  const mockDog: Dog = {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    comment: 'Good boy',
    imageUrl: 'url',
    ratingCount: 10,
    ratingSum: 40, // Average 4.0,
    created: new Date(),
    userId: 'userId',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogRateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DogRateComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    // Use fake timers for the delay(1000) in the rated output
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate average rating correctly when dog is provided', async () => {
    // Arrange & Act
    componentRef.setInput('currentDog', mockDog);
    await fixture.whenStable();

    // Assert
    expect(component.averageRating()).toBe(4);
    expect(component.currentRating()).toBe(0); // Check reset logic in computed
  });

  it('should return 0 average rating if no dog is provided', async () => {
    // Arrange & Act
    componentRef.setInput('currentDog', null);
    await fixture.whenStable();

    // Assert
    expect(component.averageRating()).toBe(0);
  });

  it('should update currentRating and status when rateDog is called', () => {
    // Act
    component.rateDog(5);

    // Assert
    expect(component.currentRating()).toBe(5);
    expect(component.status()).toBe('fadeOut');
  });

  it('should emit skipped output', () => {
    // Arrange
    const skipSpy = vi.fn();
    component.skipped.subscribe(skipSpy);

    // Act
    component.skipped.emit();

    // Assert
    expect(skipSpy).toHaveBeenCalled();
  });

  it('should emit rated output after 1000ms delay when a dog is rated', async () => {
    // Arrange
    const ratedSpy = vi.fn();
    component.rated.subscribe(ratedSpy);

    // Act
    component.rateDog(5);

    await fixture.whenStable();

    // Assert initial state (should not have emitted yet due to filter and delay)
    expect(ratedSpy).not.toHaveBeenCalled();

    // Fast-forward time
    await vi.advanceTimersByTimeAsync(1005);

    // Assert emission
    expect(ratedSpy).toHaveBeenCalledWith(5);
  });
});
