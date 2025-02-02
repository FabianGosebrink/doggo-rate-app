import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoggoFormComponent } from './doggo-form.component';

describe('DoggoFormComponent', () => {
  let component: DoggoFormComponent;
  let fixture: ComponentFixture<DoggoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoggoFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoggoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
