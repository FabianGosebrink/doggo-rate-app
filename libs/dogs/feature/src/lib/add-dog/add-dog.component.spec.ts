import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDogComponent } from './add-dog.component';
import { MockProvider } from 'ng-mocks';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AddDogStore } from './add-dog.store';

describe('AddDogComponent', () => {
  let component: AddDogComponent;
  let fixture: ComponentFixture<AddDogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDogComponent],
      providers: [
        MockProvider(AddDogStore, {
          loading: signal(false),
        }),
        provideRouter([]),
      ],
    })
      .overrideComponent(AddDogComponent, {
        set: {
          providers: [
            MockProvider(AddDogStore, {
              loading: signal(false),
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AddDogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
