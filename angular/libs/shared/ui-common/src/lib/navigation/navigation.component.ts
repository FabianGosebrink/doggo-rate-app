import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IsActiveMatchOptions,
  RouterLink,
  RouterModule,
} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: true,
  styleUrls: ['./navigation.component.css'],
  imports: [NgIf, RouterModule, RouterLink],
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

  login() {
    this.dologin.emit();
  }

  logout() {
    this.doLogout.emit();
  }
}
