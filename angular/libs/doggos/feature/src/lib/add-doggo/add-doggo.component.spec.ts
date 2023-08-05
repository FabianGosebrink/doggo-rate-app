import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoggoComponent } from './add-doggo.component';

describe('AddDoggoComponent', () => {
  let component: AddDoggoComponent;
  let fixture: ComponentFixture<AddDoggoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDoggoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoggoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
