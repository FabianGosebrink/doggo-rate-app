import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  standalone: true,
  styleUrls: ['./callback.component.css'],
  providers: [OidcSecurityService],
})
export class CallbackComponent {
  // THIS IS JUST A PLACEHOLDER TO HAVE A REDIRECT FROM THE IDP
}
