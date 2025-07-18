import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDoggoComponent } from './main-doggo.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { Doggo } from '@doggo-rating/doggos/domain';
import {
  DoggoListComponent,
  DoggoRateComponent,
} from '@doggo-rating/doggos/ui';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { MainDoggosStore } from './main-doggo.store';

describe('MainDoggoComponent', () => {
  let component: MainDoggoComponent;
  let fixture: ComponentFixture<MainDoggoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MainDoggoComponent,
        MockComponent(DoggoListComponent),
        MockComponent(DoggoRateComponent),
      ],
      providers: [provideRouter([])],
    })
      .overrideComponent(MainDoggoComponent, {
        set: {
          providers: [
            MockProvider(MainDoggosStore, {
              loading: signal(false),
              selectedDoggo: signal(null),
              doggos: signal(new Array<Doggo>()),
              loadDoggos: jest.fn(),
              selectDoggo: jest.fn(),
              startListeningToRealtimeDoggoEvents: jest.fn(),
              stopListeningToRealtimeDoggoEvents: jest.fn(),
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MainDoggoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });
});
