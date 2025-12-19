import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilRealTime } from './shared-util-real-time';

describe('SharedUtilRealTime', () => {
  let component: SharedUtilRealTime;
  let fixture: ComponentFixture<SharedUtilRealTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilRealTime],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilRealTime);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
