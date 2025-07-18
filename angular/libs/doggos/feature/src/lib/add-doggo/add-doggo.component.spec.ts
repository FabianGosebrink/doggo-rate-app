import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDoggoComponent } from './add-doggo.component';
import { MockProvider } from 'ng-mocks';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AddDoggoStore } from './add-doggo.store';

describe('AddDoggoComponent', () => {
  let component: AddDoggoComponent;
  let fixture: ComponentFixture<AddDoggoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDoggoComponent],
      providers: [
        MockProvider(AddDoggoStore, {
          loading: signal(false),
        }),
        provideRouter([]),
      ],
    })
      .overrideComponent(AddDoggoComponent, {
        set: {
          providers: [
            MockProvider(AddDoggoStore, {
              loading: signal(false),
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AddDoggoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
