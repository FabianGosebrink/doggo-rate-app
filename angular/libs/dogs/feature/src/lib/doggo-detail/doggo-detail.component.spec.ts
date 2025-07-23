import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoggoDetailComponent } from './doggo-detail.component';
import { MockProvider } from 'ng-mocks';
import { signal } from '@angular/core';
import { DoggoDetailsStore } from './doggo-detail.store';

describe('DoggoDetailComponent', () => {
  let component: DoggoDetailComponent;
  let fixture: ComponentFixture<DoggoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoggoDetailComponent],
      providers: [
        MockProvider(DoggoDetailsStore, {
          loadSingleDoggoIfNotLoaded: jest.fn(),
          detailDoggo: signal(null),
        }),
      ],
    })
      .overrideComponent(DoggoDetailComponent, {
        set: {
          providers: [
            MockProvider(DoggoDetailsStore, {
              loadSingleDoggoIfNotLoaded: jest.fn(),
              detailDoggo: signal(null),
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DoggoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
