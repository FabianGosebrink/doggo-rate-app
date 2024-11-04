import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDoggoComponent } from './main-doggo.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { Doggo, DoggosStore } from '@doggo-rating/doggos/domain';
import {
  DoggoListComponent,
  DoggoRateComponent,
} from '@doggo-rating/doggos/ui';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

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
      providers: [
        MockProvider(DoggosStore, {
          loading: signal(false),
          selectedDoggo: signal(null),
          doggos: signal(new Array<Doggo>()),
          loadDoggos: jest.fn(),
          startListeningToRealtimeDoggoEvents: jest.fn(),
          stopListeningToRealtimeDoggoEvents: jest.fn(),
        }),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainDoggoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });
});
