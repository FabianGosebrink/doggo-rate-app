import { TestBed } from '@angular/core/testing';
import { AddDogStore } from './add-dog.store';
import {
  DogsApiService,
  DogsStore,
  UploadService,
} from '@dog-rating/dogs/domain';
import { NotificationService } from '@dog-rating/shared/util-notification';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MockProvider } from 'ng-mocks';

describe('AddDogStore', () => {
  let store: InstanceType<typeof AddDogStore>;
  let uploadService: UploadService;
  let dogsApiService: DogsApiService;
  let notificationService: NotificationService;
  let dogsStore: InstanceType<typeof DogsStore>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddDogStore,
        MockProvider(UploadService),
        MockProvider(DogsApiService),
        MockProvider(NotificationService, {
          showSuccess: vi.fn(),
          showError: vi.fn(),
        }),
        MockProvider(DogsStore, {
          addDog: vi.fn(),
        }),
        MockProvider(Router),
      ],
    });

    store = TestBed.inject(AddDogStore);
    uploadService = TestBed.inject(UploadService);
    dogsApiService = TestBed.inject(DogsApiService);
    notificationService = TestBed.inject(NotificationService);
    dogsStore = TestBed.inject(DogsStore);
    router = TestBed.inject(Router);
  });

  it('should add a dog with picture successfully', () => {
    const dogData = {
      name: 'Buddy',
      breed: 'Lab',
      comment: 'Friendly',
      formData: new FormData(),
    };
    const uploadedFile = { path: 'path/to/img.png' };
    const newDog = {
      id: '1',
      name: 'Buddy',
      breed: 'Lab',
      comment: 'Friendly',
      imagePath: 'path/to/img.png',
    } as any;

    vi.spyOn(uploadService, 'upload').mockReturnValue(of(uploadedFile));
    vi.spyOn(dogsApiService, 'addDog').mockReturnValue(of(newDog));
    const routerSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    store.addDogWithPicture(dogData);

    expect(uploadService.upload).toHaveBeenCalledWith(dogData.formData);
    expect(dogsApiService.addDog).toHaveBeenCalledWith(
      'Buddy',
      'Lab',
      'Friendly',
      'path/to/img.png',
    );
    expect(dogsStore.addDog).toHaveBeenCalledWith(newDog);
    expect(notificationService.showSuccess).toHaveBeenCalledWith(
      'Dog Buddy added',
    );
    expect(routerSpy).toHaveBeenCalledWith(['/dogs/my']);
    expect(store.loading()).toBe(false);
  });

  it('should handle errors when uploading or adding a dog', () => {
    const dogData = {
      name: 'Buddy',
      breed: 'Lab',
      comment: 'Friendly',
      formData: new FormData(),
    };

    vi.spyOn(uploadService, 'upload').mockReturnValue(
      throwError(() => new Error('Upload failed')),
    );

    store.addDogWithPicture(dogData);

    expect(notificationService.showError).toHaveBeenCalled();
    expect(store.loading()).toBe(false);
  });
});
