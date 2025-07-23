import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogFormComponent } from './dog-form.component';

describe('DogFormComponent', () => {
  let component: DogFormComponent;
  let fixture: ComponentFixture<DogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
