import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoggoDetailComponent } from './doggo-detail.component';
import { MockProvider } from 'ng-mocks';
import { DoggosStore } from '@doggo-rating/doggos/domain';
import { signal } from '@angular/core';

describe('DoggoDetailComponent', () => {
  let component: DoggoDetailComponent;
  let fixture: ComponentFixture<DoggoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoggoDetailComponent],
      providers: [
        MockProvider(DoggosStore, {
          loadSingleDoggo: jest.fn(),
          clearSingleDoggo: jest.fn(),
          detailDoggo: signal(null),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoggoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
