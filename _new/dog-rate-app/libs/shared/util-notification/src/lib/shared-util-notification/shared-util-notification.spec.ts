import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilNotification } from './shared-util-notification';

describe('SharedUtilNotification', () => {
  let component: SharedUtilNotification;
  let fixture: ComponentFixture<SharedUtilNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilNotification],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilNotification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
