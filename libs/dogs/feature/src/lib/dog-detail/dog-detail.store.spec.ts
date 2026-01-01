import { TestBed } from '@angular/core/testing';
import { DogDetailsStore } from './dog-detail.store';
import { DogsApiService, DogsStore } from '@dog-rating/dogs/domain';
import { NotificationService } from '@dog-rating/shared/util-notification';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';

describe('DogDetailsStore', () => {
  let store: InstanceType<typeof DogDetailsStore>;
  let dogsApiService: DogsApiService;
  let dogsStore: InstanceType<typeof DogsStore>;
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
          entityMap: signal({}),
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
      dogsStore.entityMap.set({ 'dog-123': mockDog });

      // Act
      store.loadSingleDogIfNotLoaded('dog-123');

      // Assert
      expect(store.detailDog()).toEqual(mockDog);
    });
  });

  describe('loadSingleDogIfNotLoaded', () => {
    it('should fetch the dog from API if NOT in dogsStore', () => {
      // Arrange
      const mockDog = { id: 'new-dog', name: 'Bolt' };
      vi.spyOn(dogsApiService, 'getSingleDog').mockReturnValue(of(mockDog));
      dogsStore.entityMap.set({}); // Empty store

      // Act
      store.loadSingleDogIfNotLoaded('new-dog');

      // Assert
      expect(dogsApiService.getSingleDog).toHaveBeenCalledWith('new-dog');
      expect(dogsStore.addDog).toHaveBeenCalledWith(mockDog);
      expect(store.dogId()).toBe('new-dog');
    });

    it('should NOT fetch from API if dog is ALREADY in dogsStore', () => {
      // Arrange
      const existingDog = { id: 'old-dog', name: 'Daisy' };
      dogsStore.entityMap.set({ 'old-dog': existingDog });
      const apiSpy = vi.spyOn(dogsApiService, 'getSingleDog');

      // Act
      store.loadSingleDogIfNotLoaded('old-dog');

      // Assert
      expect(apiSpy).not.toHaveBeenCalled();
      expect(store.dogId()).toBe('old-dog');
    });

    it('should show error notification if API call fails', () => {
      // Arrange
      vi.spyOn(dogsApiService, 'getSingleDog').mockReturnValue(
        throwError(() => new Error('API Error')),
      );
      dogsStore.entityMap.set({});

      // Act
      store.loadSingleDogIfNotLoaded('error-dog');

      // Assert
      expect(notificationService.showError).toHaveBeenCalled();
    });
  });
});
