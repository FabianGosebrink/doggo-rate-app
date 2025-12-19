import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilCamera } from './shared-util-camera';

describe('SharedUtilCamera', () => {
  let component: SharedUtilCamera;
  let fixture: ComponentFixture<SharedUtilCamera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilCamera],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilCamera);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
