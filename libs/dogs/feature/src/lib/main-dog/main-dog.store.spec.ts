import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthStore } from '@dog-rating/shared/util-auth';
import { NotificationService } from '@dog-rating/shared/util-notification';
import { RealTimeStore } from '@dog-rating/shared/util-real-time';
import { Dog, DogsApiService, DogsStore } from '@dog-rating/dogs/domain';
import { MainDogStore } from './main-dog.store';

describe('MainDogStore', () => {
  let dogsApiService: DogsApiService;
  let notificationService: NotificationService;
  let router: Router;

  const mockDogs: Dog[] = [
    {
      id: 'd1',
      name: 'Buddy',
      breed: 'Golden',
      comment: '',
      imageUrl: '',
      ratingCount: 0,
      ratingSum: 0,
      created: new Date(),
      userId: 'userId',
    },
    {
      id: 'd2',
      name: 'Max',
      breed: 'Beagle',
      comment: '',
      imageUrl: '',
      ratingCount: 0,
      ratingSum: 0,
      created: new Date(),
      userId: 'userId',
    },
    {
      id: 'd3',
      name: 'Daisy',
      breed: 'Husky',
      comment: '',
      imageUrl: '',
      ratingCount: 0,
      ratingSum: 0,
      created: new Date(),
      userId: 'userId',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        MockProvider(DogsApiService, { getDogs: () => of(mockDogs) }),
        MockProvider(NotificationService, {
          showSuccess: vi.fn(),
          showError: vi.fn(),
        }),
        MockProvider(AuthStore, { userSub: signal('userId') }),
        MockProvider(RealTimeStore, {
          connection: signal({ on: vi.fn() } as any),
          startConnection: vi.fn(),
          stopConnection: vi.fn(),
        }),
        DogsStore,
        MainDogStore,
      ],
    });

    dogsApiService = TestBed.inject(DogsApiService);
    notificationService = TestBed.inject(NotificationService);
    router = TestBed.inject(Router);
  });

  describe('selectedDog (computed)', () => {
    it('should default to the first loaded dog when nothing is selected', () => {
      // Act
      const store = TestBed.inject(MainDogStore);

      // Assert
      expect(store.selectedDog()).toEqual(mockDogs[0]);
    });

    it('should return the dog matching selectedDogId once one is selected', () => {
      // Arrange
      const store = TestBed.inject(MainDogStore);

      // Act
      store.selectDog('d2');

      // Assert
      expect(store.selectedDog()).toEqual(mockDogs[1]);
    });
  });

  describe('nextDogIndex (computed)', () => {
    it('should wrap around to the first dog after the last one', () => {
      // Arrange
      const store = TestBed.inject(MainDogStore);
      store.selectDog('d3');

      // Act & Assert
      expect(store.nextDogIndex()).toBe(0);
    });

    it('should point at the first dog when nothing is selected yet', () => {
      // Arrange
      const store = TestBed.inject(MainDogStore);

      // Act & Assert
      expect(store.nextDogIndex()).toBe(0);
    });
  });

  it('should expose the loaded dogs and loading state from the root store', () => {
    // Act
    const store = TestBed.inject(MainDogStore);

    // Assert
    expect(store.dogs()).toEqual(mockDogs);
    expect(store.loading()).toBe(false);
  });

  describe('selectNextDog', () => {
    it('should advance the selection to the next dog', () => {
      // Arrange
      const store = TestBed.inject(MainDogStore);
      store.selectDog('d1');

      // Act
      store.selectNextDog();

      // Assert
      expect(store.selectedDogId()).toBe('d2');
    });
  });

  describe('rateDog', () => {
    it('should rate the selected dog and advance to the next one on success', () => {
      // Arrange
      const rateSpy = vi
        .spyOn(dogsApiService, 'rate')
        .mockReturnValue(of(undefined));
      const store = TestBed.inject(MainDogStore);
      store.selectDog('d1');

      // Act
      store.rateDog(5);

      // Assert
      expect(rateSpy).toHaveBeenCalledWith('d1', 5);
      expect(store.selectedDogId()).toBe('d2');
    });

    it('should show an error notification when rating fails', () => {
      // Arrange
      vi.spyOn(dogsApiService, 'rate').mockReturnValue(
        throwError(() => new Error('API Error')),
      );
      const store = TestBed.inject(MainDogStore);
      store.selectDog('d1');

      // Act
      store.rateDog(5);

      // Assert
      expect(notificationService.showError).toHaveBeenCalled();
    });
  });

  describe('onInit navigation', () => {
    it('should navigate to the initially selected dog', () => {
      // Arrange
      const navigateSpy = vi
        .spyOn(router, 'navigate')
        .mockResolvedValue(true);

      // Act
      TestBed.inject(MainDogStore);
      TestBed.tick();

      // Assert
      expect(navigateSpy).toHaveBeenCalledWith(['/dogs'], {
        queryParams: { dogId: 'd1' },
      });
    });

    it('should not navigate when there is no dog to select', () => {
      // Arrange
      vi.spyOn(dogsApiService, 'getDogs').mockReturnValue(of([]));
      const navigateSpy = vi
        .spyOn(router, 'navigate')
        .mockResolvedValue(true);

      // Act
      TestBed.inject(MainDogStore);
      TestBed.tick();

      // Assert
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });
});
