import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDoggosComponent } from './my-doggos.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { MyDoggosStore } from './my-doggos.store';
import { SingleDoggoComponent } from '@doggo-rating/doggos/ui';

describe('MyDoggosComponent', () => {
  let component: MyDoggosComponent;
  let fixture: ComponentFixture<MyDoggosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDoggosComponent, MockComponent(SingleDoggoComponent)],
      providers: [
        MockProvider(MyDoggosStore, {
          myDoggos: signal([]),
        }),
        provideRouter([]),
      ],
    })
      .overrideComponent(MyDoggosComponent, {
        set: {
          providers: [
            MockProvider(MyDoggosStore, {
              myDoggos: signal([]),
            }),
          ],
        },
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
