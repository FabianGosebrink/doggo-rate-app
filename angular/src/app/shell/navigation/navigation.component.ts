import { selectIsLoggedIn } from './../../auth/store/auth.selectors';
import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @Input() loggedIn = false;

  constructor(private oidcSecurityService: OidcSecurityService) {}

  ngOnInit(): void {}

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
