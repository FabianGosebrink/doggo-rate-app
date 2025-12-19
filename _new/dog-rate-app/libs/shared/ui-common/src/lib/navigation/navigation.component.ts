import { Component, input, output } from '@angular/core';
import {
  IsActiveMatchOptions,
  RouterLink,
  RouterModule,
} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [RouterModule, RouterLink],
})
export class NavigationComponent {
  loggedIn = input(false);
  login = output();
  logout = output();

  isActiveMatchOptions: IsActiveMatchOptions = {
    queryParams: 'ignored',
    matrixParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  };
}
