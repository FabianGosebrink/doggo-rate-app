import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IsActiveMatchOptions,
  RouterLink,
  RouterModule,
} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: true,
  styleUrls: ['./navigation.component.scss'],
  imports: [RouterModule, RouterLink],
})
export class NavigationComponent {
  @Input() loggedIn = false;
  @Output() dologin = new EventEmitter();
  @Output() doLogout = new EventEmitter();

  isActiveMatchOptions: IsActiveMatchOptions = {
    queryParams: 'ignored',
    matrixParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  } as IsActiveMatchOptions;

  login(): void {
    this.dologin.emit();
  }

  logout(): void {
    this.doLogout.emit();
  }
}
