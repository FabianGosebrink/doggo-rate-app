import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDogComponent } from './main-dog.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { Dog } from '@dog-rating/dogs/domain';
import { DogListComponent, DogRateComponent } from '@dog-rating/dogs/ui';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { MainDogStore } from './main-dog.store';

describe('MainDogComponent', () => {
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
            MockProvider(MainDogStore, {
              loading: signal(false),
              selectedDog: signal(null),
              dogs: signal(new Array<Dog>()),
              loadDogs: vi.fn(),
              selectDog: vi.fn(),
              startListeningToRealtimeDogEvents: vi.fn(),
              stopListeningToRealtimeDogEvents: vi.fn(),
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MainDogComponent);
    component = fixture.componentInstance;
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });
});
