import { TestBed } from '@angular/core/testing';
import { DogsApiService } from './dogs-api.service';
import { HttpService } from '@dog-rating/shared/util-common';
import { firstValueFrom, of } from 'rxjs';
import { Dog } from '../models/dog';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MockProvider } from 'ng-mocks';

describe('DogsApiService', () => {
  let service: DogsApiService;
  let httpMock: HttpService;

  const mockDog: Dog = {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    comment: 'Good boy',
    imageUrl: 'url',
    ratingCount: 0,
    ratingSum: 0,
    created: new Date(),
    userId: 'userId',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(HttpService)],
    });

    service = TestBed.inject(DogsApiService);
    httpMock = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all dogs', async () => {
    // Arrange
    const mockDogs = [mockDog];
    // Cast to any or use vi.spyOn to ensure Vitest sees the method as a spy
    vi.spyOn(httpMock, 'get').mockReturnValue(of(mockDogs));

    // Act
    const dogs = await firstValueFrom(service.getDogs());

    // Assert
    expect(dogs).toEqual(mockDogs);
    expect(httpMock.get).toHaveBeenCalledWith(
      expect.stringContaining('api/dogs'),
    );
  });

  it('should add a new dog', async () => {
    // Arrange
    vi.spyOn(httpMock, 'post').mockReturnValue(of(mockDog));

    // Act
    const dog = await firstValueFrom(
      service.addDog('Buddy', 'Golden', 'Comment', 'url'),
    );

    // Assert
    expect(dog).toEqual(mockDog);
    expect(httpMock.post).toHaveBeenCalledWith(
      expect.stringContaining('api/dogs'),
      expect.objectContaining({ name: 'Buddy' }),
    );
  });

  it('should delete a dog and return the dog object', async () => {
    // Arrange
    vi.spyOn(httpMock, 'delete').mockReturnValue(of({}));

    // Act
    const result = await firstValueFrom(service.deleteDog(mockDog));

    // Assert
    expect(result).toEqual(mockDog);
    expect(httpMock.delete).toHaveBeenCalledWith(
      expect.stringContaining('api/dogs/1'),
    );
  });
});
