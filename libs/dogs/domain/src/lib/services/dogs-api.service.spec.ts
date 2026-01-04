import { TestBed } from '@angular/core/testing';
import { DogsApiService } from './dogs-api.service';
import { HttpService } from '@dog-rating/shared/util-common';
import { firstValueFrom, of } from 'rxjs';
import { Dog } from '../models/dog';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockProvider, ngMocks } from 'ng-mocks';

describe('DogsApiService', () => {
  let service: DogsApiService;
  let httpMock: HttpService;

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

  beforeAll(() => {
    ngMocks.defaultMock(HttpService, () => ({
      get: vi.fn().mockReturnValue(of([mockDog])),
      post: vi.fn().mockReturnValue(of(mockDog)),
      put: vi.fn().mockReturnValue(of(mockDog)),
      delete: vi.fn().mockReturnValue(of({})),
    }));
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DogsApiService, MockProvider(HttpService)],
    });

    service = TestBed.inject(DogsApiService);
    httpMock = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all dogs (getDogs)', async () => {
    // Act
    const result = await firstValueFrom(service.getDogs());

    // Assert
    expect(result).toEqual([mockDog]);
    expect(httpMock.get).toHaveBeenCalledWith(
      expect.stringContaining('api/dogs'),
    );
  });

  it('should fetch a single dog (getSingleDog)', async () => {
    // Arrange
    vi.mocked(httpMock.get).mockReturnValue(of(mockDog));

    // Act
    const result = await firstValueFrom(service.getSingleDog('1'));

    // Assert
    expect(result).toEqual(mockDog);
    expect(httpMock.get).toHaveBeenCalledWith(
      expect.stringContaining('api/dogs/1'),
    );
  });

  it('should fetch user dogs (getMyDogs)', async () => {
    // Act
    const result = await firstValueFrom(service.getMyDogs());

    // Assert
    expect(result).toEqual([mockDog]);
    expect(httpMock.get).toHaveBeenCalledWith(
      expect.stringContaining('api/dogs/my'),
    );
  });

  it('should add a new dog (addDog)', async () => {
    // Act
    const result = await firstValueFrom(
      service.addDog('Buddy', 'Golden', 'Comment', 'url'),
    );

    // Assert
    expect(result).toEqual(mockDog);
    expect(httpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('api/dogs'),
      expect.any(Object),
    );
  });

  it('should delete a dog and map the result (deleteDog)', async () => {
    // Act
    const result = await firstValueFrom(service.deleteDog(mockDog));

    // Assert
    expect(result).toEqual(mockDog);
    expect(httpMock.delete).toHaveBeenCalledWith(
      expect.stringContaining('api/dogs/1'),
    );
  });

  it('should rate a dog (rate)', async () => {
    // Act
    const result = await firstValueFrom(service.rate('1', 5));

    // Assert
    expect(result).toEqual(mockDog);
    expect(httpMock.put).toHaveBeenCalledWith(
      expect.stringContaining('api/dogs/rate/1'),
      { value: 5 },
    );
  });
});
