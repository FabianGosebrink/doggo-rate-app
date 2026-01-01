import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyDogsComponent } from './my-dogs.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { MyDogsStore } from './my-dogs.store';
import { SingleDogComponent } from '@dog-rating/dogs/ui';
import { Dog, dogUserEvents } from '@dog-rating/dogs/domain';
import { Dispatcher } from '@ngrx/signals/events';

describe('MyDogsComponent', () => {
  let component: MyDogsComponent;
  let fixture: ComponentFixture<MyDogsComponent>;
  let dispatcher: Dispatcher;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDogsComponent, MockComponent(SingleDogComponent)],
      providers: [
        provideRouter([]),
        MockProvider(Dispatcher, {
          dispatch: vi.fn(),
        }),
      ],
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
    dispatcher = TestBed.inject(Dispatcher);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch deleteDog event when deleteDog is called', () => {
    const mockDog = { id: '123', name: 'Buddy' } as Dog;
    fixture.detectChanges();

    component.deleteDog(mockDog);

    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      dogUserEvents.deleteDog(mockDog),
    );
  });
});
