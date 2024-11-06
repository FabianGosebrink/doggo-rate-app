import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDoggosComponent } from './my-doggos.component';
import { MockProvider } from 'ng-mocks';
import { DoggosStore } from '@doggo-rating/doggos/domain';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

describe('MyDoggosComponent', () => {
  let component: MyDoggosComponent;
  let fixture: ComponentFixture<MyDoggosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDoggosComponent],
      providers: [
        MockProvider(DoggosStore, {
          loadMyDoggos: jest.fn(),
          myDoggos: signal([]),
        }),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyDoggosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
