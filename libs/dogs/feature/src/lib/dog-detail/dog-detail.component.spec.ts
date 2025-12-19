import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogDetailComponent } from './dog-detail.component';
import { MockProvider } from 'ng-mocks';
import { signal } from '@angular/core';
import { DogDetailsStore } from './dog-detail.store';

describe('DogDetailComponent', () => {
  let component: DogDetailComponent;
  let fixture: ComponentFixture<DogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogDetailComponent],
      providers: [
        MockProvider(DogDetailsStore, {
          loadSingleDogIfNotLoaded: jest.fn(),
          detailDog: signal(null),
        }),
      ],
    })
      .overrideComponent(DogDetailComponent, {
        set: {
          providers: [
            MockProvider(DogDetailsStore, {
              loadSingleDogIfNotLoaded: jest.fn(),
              detailDog: signal(null),
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
