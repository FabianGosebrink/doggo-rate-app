import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  standalone: true,
  styleUrls: ['./callback.component.css'],
})
export class CallbackComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    // THIS IS JUST A PLACEHOLDER TO HAVE A REDIRECT FROM THE IDP

    this.router.navigate(['']);
  }
}
