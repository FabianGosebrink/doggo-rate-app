import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
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
