import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogRateComponent } from './dog-rate.component';

describe('DogRateComponent', () => {
  let component: DogRateComponent;
  let fixture: ComponentFixture<DogRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogRateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DogRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
