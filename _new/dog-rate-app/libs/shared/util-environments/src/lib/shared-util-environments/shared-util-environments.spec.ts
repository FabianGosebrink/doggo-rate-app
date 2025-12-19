import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilEnvironments } from './shared-util-environments';

describe('SharedUtilEnvironments', () => {
  let component: SharedUtilEnvironments;
  let fixture: ComponentFixture<SharedUtilEnvironments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilEnvironments],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilEnvironments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
