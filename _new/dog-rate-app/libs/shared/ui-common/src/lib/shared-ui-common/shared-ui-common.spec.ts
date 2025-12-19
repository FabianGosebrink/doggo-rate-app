import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiCommon } from './shared-ui-common';

describe('SharedUiCommon', () => {
  let component: SharedUiCommon;
  let fixture: ComponentFixture<SharedUiCommon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiCommon],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiCommon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
