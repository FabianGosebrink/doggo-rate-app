import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { FooterComponent } from '../footer/footer.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { AuthActions } from './../../auth/store/auth.actions';
import { selectIsLoggedIn } from './../../auth/store/auth.selectors';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [FooterComponent, NavigationComponent, RouterModule],
})
export class LayoutComponent {
  private readonly store = inject(Store);

  isLoggedIn = this.store.selectSignal(selectIsLoggedIn);

  login() {
    this.store.dispatch(AuthActions.login());
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
