import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyDogsComponent } from './my-dogs.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { MyDogsStore } from './my-dogs.store';
import { SingleDogComponent } from '@dog-rating/dogs/ui';

describe('MyDogsComponent', () => {
  let component: MyDogsComponent;
  let fixture: ComponentFixture<MyDogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDogsComponent, MockComponent(SingleDogComponent)],
      providers: [provideRouter([])],
    })
      .overrideComponent(MyDogsComponent, {
        set: {
          providers: [
            MockProvider(MyDogsStore, {
              myDogs: signal([]),
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MyDogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
