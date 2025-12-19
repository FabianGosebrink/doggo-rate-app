import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutFeature } from './about-feature';

describe('AboutFeature', () => {
  let component: AboutFeature;
  let fixture: ComponentFixture<AboutFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
