import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleDoggoComponent } from './single-doggo.component';

describe('SingleDoggoComponent', () => {
  let component: SingleDoggoComponent;
  let fixture: ComponentFixture<SingleDoggoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleDoggoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleDoggoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
