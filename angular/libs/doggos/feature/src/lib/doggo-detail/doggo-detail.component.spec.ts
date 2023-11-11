import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoggoDetailComponent } from './doggo-detail.component';

describe('DoggoDetailComponent', () => {
  let component: DoggoDetailComponent;
  let fixture: ComponentFixture<DoggoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoggoDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoggoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
