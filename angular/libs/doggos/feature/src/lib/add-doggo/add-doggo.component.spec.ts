import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoggoComponent } from './add-doggo.component';
import { MockProvider } from 'ng-mocks';
import { DoggosStore } from '@doggo-rating/doggos/domain';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('AddDoggoComponent', () => {
  let component: AddDoggoComponent;
  let fixture: ComponentFixture<AddDoggoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDoggoComponent],
      providers: [
        MockProvider(DoggosStore, {
          loading: signal(false),
        }),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddDoggoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
