import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDogComponent } from './main-dog.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { Dog } from '@dog-rating/dogs/domain';
import { DogListComponent, DogRateComponent } from '@dog-rating/dogs/ui';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { MainDogsStore } from './main-dog.store';

describe('MainDoggoComponent', () => {
  let component: MainDogComponent;
  let fixture: ComponentFixture<MainDogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MainDogComponent,
        MockComponent(DogListComponent),
        MockComponent(DogRateComponent),
      ],
      providers: [provideRouter([])],
    })
      .overrideComponent(MainDogComponent, {
        set: {
          providers: [
            MockProvider(MainDogsStore, {
              loading: signal(false),
              selectedDoggo: signal(null),
              doggos: signal(new Array<Dog>()),
              loadDoggos: jest.fn(),
              selectDoggo: jest.fn(),
              startListeningToRealtimeDoggoEvents: jest.fn(),
              stopListeningToRealtimeDoggoEvents: jest.fn(),
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MainDogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });
});
