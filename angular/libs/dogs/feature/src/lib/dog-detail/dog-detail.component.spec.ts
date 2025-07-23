import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogDetailComponent } from './dog-detail.component';
import { MockProvider } from 'ng-mocks';
import { signal } from '@angular/core';
import { DoggoDetailsStore } from './dog-detail.store';

describe('DoggoDetailComponent', () => {
  let component: DogDetailComponent;
  let fixture: ComponentFixture<DogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogDetailComponent],
      providers: [
        MockProvider(DoggoDetailsStore, {
          loadSingleDoggoIfNotLoaded: jest.fn(),
          detailDoggo: signal(null),
        }),
      ],
    })
      .overrideComponent(DogDetailComponent, {
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

    fixture = TestBed.createComponent(DogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
