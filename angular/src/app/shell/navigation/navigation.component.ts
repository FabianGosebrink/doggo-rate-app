import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: true,
  styleUrls: ['./navigation.component.css'],
  imports: [NgIf, RouterModule, RouterLink],
})
export class NavigationComponent implements OnInit {
  @Input() loggedIn = false;
  @Input() doggoCount = 0;
  @Output() dologin = new EventEmitter();
  @Output() doLogout = new EventEmitter();

  ngOnInit(): void {}

  login() {
    this.dologin.emit();
  }

  logout() {
    this.doLogout.emit();
  }
}
