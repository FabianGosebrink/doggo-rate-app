import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogListComponent } from './dog-list.component';
import { Dog } from '@dog-rating/dogs/domain';

describe('DogListComponent', () => {
  let component: DogListComponent;
  let fixture: ComponentFixture<DogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when method is called', () => {
    // arrange
    const spy = jest.spyOn(component.dogSelected, 'emit');

    // act
    component.selectDog({ id: 'my-id' } as Dog);

    // assert
    expect(spy).toHaveBeenCalled();
  });
});
