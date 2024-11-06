import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutComponent } from './layout.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { FooterComponent } from '../footer/footer.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { provideRouter } from '@angular/router';
import { RealTimeStore } from '@doggo-rating/shared/util-real-time';
import { AuthStore } from '@doggo-rating/shared/util-auth';
import { signal } from '@angular/core';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        MockComponent(NavigationComponent),
        MockComponent(FooterComponent),
      ],
      providers: [
        provideRouter([]),
        MockProvider(RealTimeStore, {
          connectionStatus: signal('Not Set'),
        }),
        MockProvider(AuthStore, {
          isLoggedIn: signal(false),
          userEmail: signal(''),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
