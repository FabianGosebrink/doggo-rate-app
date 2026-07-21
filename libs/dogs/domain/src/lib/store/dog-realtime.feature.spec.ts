import { TestBed } from '@angular/core/testing';
import { signalStore } from '@ngrx/signals';
import { AuthStore } from '@dog-rating/shared/util-auth';
import { NotificationService } from '@dog-rating/shared/util-notification';
import { RealTimeStore } from '@dog-rating/shared/util-real-time';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dog } from '../models/dog';
import { withDogRealtime } from './dog-realtime.feature';
import { DogsStore } from './dogs.store';

const TestRealtimeStore = signalStore(withDogRealtime());

describe('withDogRealtime', () => {
  let realTimeStore: InstanceType<typeof RealTimeStore>;
  let dogsStore: InstanceType<typeof DogsStore>;
  let notificationService: NotificationService;

  let connectionMock: {
    on: any;
  };

  const mockDog = { id: '1', name: 'Buddy', userId: 'my-user' } as Dog;

  function getRealTimeCallback(eventName: string) {
    const call = connectionMock.on.mock.calls.find(
      ([name]: [string]) => name === eventName,
    );

    return call[1];
  }

  beforeEach(() => {
    connectionMock = {
      on: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: RealTimeStore,
          useValue: {
            connection: vi.fn().mockReturnValue(connectionMock),
            startConnection: vi.fn(),
            stopConnection: vi.fn(),
          },
        },
        {
          provide: DogsStore,
          useValue: {
            addDog: vi.fn(),
            removeDog: vi.fn(),
            updateDog: vi.fn(),
          },
        },
        {
          provide: AuthStore,
          useValue: { userSub: vi.fn().mockReturnValue('my-user') },
        },
        {
          provide: NotificationService,
          useValue: { showSuccess: vi.fn(), showError: vi.fn() },
        },
        TestRealtimeStore,
      ],
    });

    realTimeStore = TestBed.inject(RealTimeStore);
    dogsStore = TestBed.inject(DogsStore);
    notificationService = TestBed.inject(NotificationService);
    TestBed.inject(TestRealtimeStore);
  });

  it('should listen to all real time events and start the connection on init', () => {
    // Assert
    expect(connectionMock.on).toHaveBeenCalledWith(
      'dogadded',
      expect.any(Function),
    );
    expect(connectionMock.on).toHaveBeenCalledWith(
      'dogdeleted',
      expect.any(Function),
    );
    expect(connectionMock.on).toHaveBeenCalledWith(
      'dograted',
      expect.any(Function),
    );
    expect(realTimeStore.startConnection).toHaveBeenCalled();
  });

  it('should add a dog when a dog was added in real time', () => {
    // Arrange
    const dogAddedCallback = getRealTimeCallback('dogadded');

    // Act
    dogAddedCallback(mockDog);

    // Assert
    expect(dogsStore.addDog).toHaveBeenCalledWith(mockDog);
  });

  it('should remove a dog when a dog was deleted in real time', () => {
    // Arrange
    const dogDeletedCallback = getRealTimeCallback('dogdeleted');

    // Act
    dogDeletedCallback('1');

    // Assert
    expect(dogsStore.removeDog).toHaveBeenCalledWith('1');
  });

  it('should update the dog and notify when my own dog was rated in real time', () => {
    // Arrange
    const dogRatedCallback = getRealTimeCallback('dograted');

    // Act
    dogRatedCallback(mockDog);

    // Assert
    expect(dogsStore.updateDog).toHaveBeenCalledWith(mockDog);
    expect(notificationService.showSuccess).toHaveBeenCalledWith(
      'Buddy was just rated!!!',
    );
  });

  it('should update the dog without notifying when a foreign dog was rated in real time', () => {
    // Arrange
    const dogRatedCallback = getRealTimeCallback('dograted');
    const foreignDog = { ...mockDog, userId: 'other-user' };

    // Act
    dogRatedCallback(foreignDog);

    // Assert
    expect(dogsStore.updateDog).toHaveBeenCalledWith(foreignDog);
    expect(notificationService.showSuccess).not.toHaveBeenCalled();
  });

  it('should stop the connection on destroy', () => {
    // Act
    TestBed.resetTestingModule();

    // Assert
    expect(realTimeStore.stopConnection).toHaveBeenCalled();
  });
});
