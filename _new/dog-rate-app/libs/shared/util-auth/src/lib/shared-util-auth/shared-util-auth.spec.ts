import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilAuth } from './shared-util-auth';

describe('SharedUtilAuth', () => {
  let component: SharedUtilAuth;
  let fixture: ComponentFixture<SharedUtilAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilAuth],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilAuth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
