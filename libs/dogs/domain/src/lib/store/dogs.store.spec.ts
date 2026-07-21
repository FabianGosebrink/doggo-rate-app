import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { NotificationService } from '@dog-rating/shared/util-notification';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dog } from '../models/dog';
import { DogsApiService } from '../services/dogs-api.service';
import { dogUserEvents } from './dog-remove.feature';
import { DogsStore } from './dogs.store';

describe('DogsStore', () => {
  let store: InstanceType<typeof DogsStore>;
  let dogsApiService: DogsApiService;
  let notificationService: NotificationService;
  let router: Router;
  let dispatcher: Dispatcher;

  const mockDog: Dog = {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    comment: 'Good boy',
    imageUrl: 'url',
    ratingCount: 10,
    ratingSum: 50,
    created: new Date(),
    userId: 'userId',
  };

  function configureDogsStore(dogs: Dog[] | 'error') {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        MockProvider(DogsApiService, {
          getDogs: () =>
            dogs === 'error' ? throwError(() => new Error('failed')) : of(dogs),
          deleteDog: vi.fn().mockReturnValue(of(undefined)),
        }),
        MockProvider(NotificationService, {
          showSuccess: vi.fn(),
          showError: vi.fn(),
        }),
      ],
    });

    return {
      store: TestBed.inject(DogsStore),
      dogsApiService: TestBed.inject(DogsApiService),
      notificationService: TestBed.inject(NotificationService),
      router: TestBed.inject(Router),
      dispatcher: TestBed.inject(Dispatcher),
    };
  }

  beforeEach(() => {
    ({ store, dogsApiService, notificationService, router, dispatcher } =
      configureDogsStore([mockDog]));
  });

  it('should load all dogs on init', () => {
    // Assert
    expect(store.entities()).toEqual([mockDog]);
    expect(store.loading()).toBe(false);
    expect(notificationService.showSuccess).toHaveBeenCalledWith('Dogs Loaded');
  });

  it('should show an error when loading the dogs fails', () => {
    // Arrange
    TestBed.resetTestingModule();
    ({ store, notificationService } = configureDogsStore('error'));

    // Assert
    expect(store.entities()).toEqual([]);
    expect(notificationService.showError).toHaveBeenCalled();
  });

  it('should remove a dog', () => {
    // Act
    store.removeDog('1');

    // Assert
    expect(store.entities()).toEqual([]);
  });

  it('should add a dog', () => {
    // Arrange
    const newDog = { ...mockDog, id: '2', name: 'Rex' };

    // Act
    store.addDog(newDog);

    // Assert
    expect(store.entities()).toEqual([mockDog, newDog]);
  });

  it('should update a dog', () => {
    // Act
    store.updateDog({ ...mockDog, name: 'Buddy Jr.' });

    // Assert
    expect(store.entities()).toEqual([{ ...mockDog, name: 'Buddy Jr.' }]);
  });

  describe('deleteDog event', () => {
    it('should delete the dog, remove it from the state and navigate to my dogs', () => {
      // Arrange
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      // Act
      dispatcher.dispatch(dogUserEvents.deleteDog(mockDog));

      // Assert
      expect(dogsApiService.deleteDog).toHaveBeenCalledWith(mockDog);
      expect(store.entities()).toEqual([]);
      expect(navigateSpy).toHaveBeenCalledWith(['/dogs/my']);
    });

    it('should show an error and keep the dog when deleting fails', () => {
      // Arrange
      vi.mocked(dogsApiService.deleteDog).mockReturnValue(
        throwError(() => new Error('failed')),
      );

      // Act
      dispatcher.dispatch(dogUserEvents.deleteDog(mockDog));

      // Assert
      expect(notificationService.showError).toHaveBeenCalled();
      expect(store.entities()).toEqual([mockDog]);
    });
  });
});
