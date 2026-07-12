import { TestBed } from '@angular/core/testing';
import { DogDetailsStore } from './dog-detail.store';
import { Dog, DogsApiService, DogsStore } from '@dog-rating/dogs/domain';
import { NotificationService } from '@dog-rating/shared/util-notification';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('DogDetailsStore', () => {
  let store: any;
  let dogsApiService: DogsApiService;
  let dogsStore: any;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DogDetailsStore,
        MockProvider(DogsApiService),
        MockProvider(NotificationService, {
          showSuccess: vi.fn(),
          showError: vi.fn(),
        }),
        MockProvider(DogsStore, {
          entityMap: vi.fn(() => ({})),
          addDog: vi.fn(),
        }),
      ],
    });

    store = TestBed.inject(DogDetailsStore);
    dogsApiService = TestBed.inject(DogsApiService);
    dogsStore = TestBed.inject(DogsStore);
    notificationService = TestBed.inject(NotificationService);
  });

  describe('detailDog (computed)', () => {
    it('should return null if no dogId is set', () => {
      // Act & Assert
      expect(store.detailDog()).toBeNull();
    });

    it('should return the dog from entityMap when dogId is set', () => {
      // Arrange
      const mockDog = { id: 'dog-123', name: 'Rex' };
      vi.spyOn(dogsStore, 'entityMap').mockReturnValue({ 'dog-123': mockDog });

      // Act
      store.loadSingleDogIfNotLoaded('dog-123');

      // Assert
      expect(store.detailDog()).toEqual(mockDog);
    });
  });

  describe('loadSingleDogIfNotLoaded', () => {
    it('should fetch the dog from API if NOT in dogsStore', () => {
      // Arrange
      const mockDog = { id: 'new-dog', name: 'Bolt' } as Dog;
      const getSingleDogSpy = vi
        .spyOn(dogsApiService, 'getSingleDog')
        .mockReturnValue(of(mockDog));
      vi.spyOn(dogsStore, 'entityMap').mockReturnValue({});

      // Act
      store.loadSingleDogIfNotLoaded('new-dog');

      // Assert
      expect(getSingleDogSpy).toHaveBeenCalledWith('new-dog');
      expect(dogsStore.addDog).toHaveBeenCalledWith(mockDog);
    });

    it('should NOT fetch from API if dog is ALREADY in dogsStore', () => {
      // Arrange
      const existingDog = { id: 'old-dog', name: 'Daisy' };
      vi.spyOn(dogsStore, 'entityMap').mockReturnValue({
        'old-dog': existingDog,
      });
      const apiSpy = vi.spyOn(dogsApiService, 'getSingleDog');

      // Act
      store.loadSingleDogIfNotLoaded('old-dog');

      // Assert
      expect(apiSpy).not.toHaveBeenCalled();
    });

    it('should show error notification if API call fails', () => {
      // Arrange
      vi.spyOn(dogsApiService, 'getSingleDog').mockReturnValue(
        throwError(() => new Error('API Error')),
      );
      vi.spyOn(dogsStore, 'entityMap').mockReturnValue({});

      // Act
      store.loadSingleDogIfNotLoaded('error-dog');

      // Assert
      expect(notificationService.showError).toHaveBeenCalled();
    });
  });
});
