import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilCommon } from './shared-util-common';

describe('SharedUtilCommon', () => {
  let component: SharedUtilCommon;
  let fixture: ComponentFixture<SharedUtilCommon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilCommon],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilCommon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
