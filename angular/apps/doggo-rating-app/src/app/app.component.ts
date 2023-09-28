import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '@ps-doggo-rating/shared/util-auth';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.css'],
  imports: [LayoutComponent],
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);

  title = 'ratemydoggo';

  ngOnInit(): void {
    this.store.dispatch(AuthActions.checkAuth());
  }
}
