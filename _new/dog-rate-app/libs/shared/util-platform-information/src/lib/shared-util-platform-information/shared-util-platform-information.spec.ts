import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilPlatformInformation } from './shared-util-platform-information';

describe('SharedUtilPlatformInformation', () => {
  let component: SharedUtilPlatformInformation;
  let fixture: ComponentFixture<SharedUtilPlatformInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilPlatformInformation],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilPlatformInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
