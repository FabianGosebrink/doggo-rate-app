import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogDetailComponent } from './dog-detail.component';
import { MockProvider } from 'ng-mocks';
import { signal } from '@angular/core';
import { DogDetailsStore } from './dog-detail.store';
import { Dispatcher } from '@ngrx/signals/events';
import { dogUserEvents } from '@dog-rating/dogs/domain';

describe('DogDetailComponent', () => {
  let component: DogDetailComponent;
  let fixture: ComponentFixture<DogDetailComponent>;
  let store: InstanceType<typeof DogDetailsStore>;
  let dispatcher: Dispatcher;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogDetailComponent],
      providers: [
        MockProvider(Dispatcher, {
          dispatch: vi.fn(),
        }),
      ],
    })
      .overrideComponent(DogDetailComponent, {
        set: {
          providers: [
            MockProvider(DogDetailsStore, {
              loadSingleDogIfNotLoaded: vi.fn(),
              detailDog: signal(null),
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DogDetailComponent);
    component = fixture.componentInstance;
    store = fixture.debugElement.injector.get(DogDetailsStore);
    dispatcher = TestBed.inject(Dispatcher);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dog details on init', async () => {
    fixture.componentRef.setInput('dogId', '123');
    await fixture.whenStable();

    expect(store.loadSingleDogIfNotLoaded).toHaveBeenCalledWith(
      component.dogId,
    );
  });

  it('should dispatch deleteDog event when deleteDog is called', async () => {
    const mockDog = { id: '123', name: 'Buddy' } as any;
    await fixture.whenStable();

    component.deleteDog(mockDog);

    expect(dispatcher.dispatch).toHaveBeenCalledWith(
      dogUserEvents.deleteDog(mockDog),
    );
  });
});
