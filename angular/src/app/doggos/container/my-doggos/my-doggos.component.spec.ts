import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDoggosComponent } from './my-doggos.component';

describe('MyDoggosComponent', () => {
  let component: MyDoggosComponent;
  let fixture: ComponentFixture<MyDoggosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyDoggosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDoggosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
