import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoggoListComponent } from './doggo-list.component';

describe('DoggoListComponent', () => {
  let component: DoggoListComponent;
  let fixture: ComponentFixture<DoggoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoggoListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoggoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
