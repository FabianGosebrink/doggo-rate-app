import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogListComponent } from './dog-list.component';

describe('DogListComponent', () => {
  let component: DogListComponent;
  let fixture: ComponentFixture<DogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DogListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
