import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogsFeature } from './dogs-feature';

describe('DogsFeature', () => {
  let component: DogsFeature;
  let fixture: ComponentFixture<DogsFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogsFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(DogsFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
