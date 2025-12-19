import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogsDomain } from './dogs-domain';

describe('DogsDomain', () => {
  let component: DogsDomain;
  let fixture: ComponentFixture<DogsDomain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogsDomain],
    }).compileComponents();

    fixture = TestBed.createComponent(DogsDomain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
