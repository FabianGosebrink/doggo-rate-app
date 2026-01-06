import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDogComponent } from './add-dog.component';
import { MockProvider } from 'ng-mocks';
import { signal } from '@angular/core';
import { AddDogStore } from './add-dog.store';

describe('AddDogComponent', () => {
  let component: AddDogComponent;
  let fixture: ComponentFixture<AddDogComponent>;
  let store: InstanceType<typeof AddDogStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDogComponent],
    })
      .overrideComponent(AddDogComponent, {
        set: {
          providers: [
            MockProvider(AddDogStore, {
              loading: signal(false),
              addDogWithPicture: vi.fn(),
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AddDogComponent);
    component = fixture.componentInstance;
    store = fixture.debugElement.injector.get(AddDogStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addDogWithPicture on the store when addDog is called', () => {
    const spy = vi.spyOn(store, 'addDogWithPicture');
    const dogData = {
      name: 'Buddy',
      comment: 'Good boy',
      breed: 'Golden Retriever',
      formData: new FormData(),
    };

    component.addDog(dogData);

    expect(spy).toHaveBeenCalledWith(dogData);
  });
});
