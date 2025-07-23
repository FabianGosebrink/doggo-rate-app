import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoggoListComponent } from './doggo-list.component';
import { Doggo } from '@doggo-rating/doggos/domain';

describe('DoggoListComponent', () => {
  let component: DoggoListComponent;
  let fixture: ComponentFixture<DoggoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoggoListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoggoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when method is called', () => {
    // arrange
    const spy = jest.spyOn(component.doggoSelected, 'emit');

    // act
    component.selectDoggo({ id: 'my-id' } as Doggo);

    // assert
    expect(spy).toHaveBeenCalled();
  });
});
