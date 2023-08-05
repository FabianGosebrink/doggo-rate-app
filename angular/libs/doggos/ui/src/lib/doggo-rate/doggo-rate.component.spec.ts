import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoggoRateComponent } from './doggo-rate.component';

describe('DoggoRateComponent', () => {
  let component: DoggoRateComponent;
  let fixture: ComponentFixture<DoggoRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoggoRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoggoRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
