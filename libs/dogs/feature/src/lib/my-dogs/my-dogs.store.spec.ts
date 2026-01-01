import { TestBed } from '@angular/core/testing';
import { MyDogsStore } from './my-dogs.store';
import { Dog, DogsApiService, DogsStore } from '@dog-rating/dogs/domain';
import { NotificationService } from '@dog-rating/shared/util-notification';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('MyDogsStore', () => {
  let store: InstanceType<typeof MyDogsStore>;
  let dogsApiService: DogsApiService;
  let notificationService: NotificationService;

  const mockDogs: Dog[] = [
    {
      id: '1',
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
      id: '2',
      name: 'Max',
      breed: 'Beagle',
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
        MockProvider(DogsApiService, {
          getDogs: () => of(mockDogs),
          getMyDogs: () => of([]),
        }),
        MockProvider(NotificationService, {
          showSuccess: vi.fn(),
          showError: vi.fn(),
        }),
        DogsStore,
        MyDogsStore,
      ],
    });

    dogsApiService = TestBed.inject(DogsApiService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should load my dogs and map them from the entity store', () => {
    // Arrange
    const myDogsMock = [mockDogs[0]];
    vi.spyOn(dogsApiService, 'getMyDogs').mockReturnValue(of(myDogsMock));

    // Act: Re-trigger load or use the instance.
    // Since onInit already ran, we call the method to simulate the specific action.
    store = TestBed.inject(MyDogsStore);
    store.loadMyDogs();

    // Assert
    expect(store.myDogsIds()).toEqual(['1']);
    expect(store.myDogs()).toEqual([mockDogs[0]]);
  });

  it('should show error notification when loading fails', () => {
    // Arrange
    vi.spyOn(dogsApiService, 'getMyDogs').mockReturnValue(
      throwError(() => new Error('API Error')),
    );
    vi.spyOn(notificationService, 'showError');
    store = TestBed.inject(MyDogsStore);

    // Act
    store.loadMyDogs();

    // Assert
    expect(notificationService.showError).toHaveBeenCalled();
  });
});
