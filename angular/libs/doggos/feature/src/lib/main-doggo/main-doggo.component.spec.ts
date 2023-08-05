import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDoggoComponent } from './main-doggo.component';

describe('MainDoggoComponent', () => {
  let component: MainDoggoComponent;
  let fixture: ComponentFixture<MainDoggoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainDoggoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDoggoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
