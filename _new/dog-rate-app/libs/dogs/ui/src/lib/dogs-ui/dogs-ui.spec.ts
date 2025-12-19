import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogsUi } from './dogs-ui';

describe('DogsUi', () => {
  let component: DogsUi;
  let fixture: ComponentFixture<DogsUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogsUi],
    }).compileComponents();

    fixture = TestBed.createComponent(DogsUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
