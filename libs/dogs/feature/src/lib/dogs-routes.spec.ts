import { isAuthenticated } from '@dog-rating/shared/util-auth';
import { describe, expect, it } from 'vitest';
import { AddDogComponent } from './add-dog/add-dog.component';
import { DogDetailComponent } from './dog-detail/dog-detail.component';
import { DOGS_ROUTES } from './dogs-routes';
import { MainDogComponent } from './main-dog/main-dog.component';
import { MyDogsComponent } from './my-dogs/my-dogs.component';

describe('DOGS_ROUTES', () => {
  it('should show the main dog component on the root path without a guard', () => {
    // Assert
    expect(DOGS_ROUTES[0]).toEqual({ path: '', component: MainDogComponent });
  });

  it('should guard my dogs, adding a dog and the dog details', () => {
    // Assert
    expect(DOGS_ROUTES[1]).toEqual({
      path: 'my',
      component: MyDogsComponent,
      canActivate: [isAuthenticated],
    });
    expect(DOGS_ROUTES[2]).toEqual({
      path: 'my/add',
      component: AddDogComponent,
      canActivate: [isAuthenticated],
    });
    expect(DOGS_ROUTES[3]).toEqual({
      path: 'details/:dogId',
      component: DogDetailComponent,
      canActivate: [isAuthenticated],
    });
  });
});
